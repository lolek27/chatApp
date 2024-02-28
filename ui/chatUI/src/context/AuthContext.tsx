import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios, { AxiosResponse } from "axios";
// import useSWR from "swr";
import useSWRMutation, { TriggerWithArgs } from "swr/mutation";
import { Outlet, useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";

export type User = {
  id: string;
  name: string;
  image?: string;
};

export function useSignUp() {
  const navigate = useNavigate();
  const cacheKey = `${import.meta.env.VITE_SERVER_URL}/users`;
  const { trigger: signup, isMutating } = useSWRMutation(
    cacheKey,
    async (url: string, { arg }: { arg: User }) => {
      return await axios.post(`${cacheKey}/signup`, arg);
    },
    {
      onSuccess: () => navigate("/login"),
    }
  );

  return { signup, isSigningUp: isMutating };
}

export function useLogin() {
  const [loggedUser, setLoggedUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [streamChat, setStreamChat] = useState<StreamChat>();
  const cacheKey = `${import.meta.env.VITE_SERVER_URL}/users`;
  const { trigger: login, isMutating } = useSWRMutation(
    cacheKey,
    async (url: string, { arg }: { arg: string }) => {
      const {
        data: { token, user },
      }: { data: { token: string; user: User } } = await axios.post(
        `${cacheKey}/login`,
        { id: arg }
      );
      return { token, user };
    },
    {
      onSuccess: (data) => {
        setToken(data.token);
        setLoggedUser(data.user);
      },
    }
  );

  useEffect(() => {
    if (!token || !loggedUser) {
      return;
    }
    const chat = new StreamChat(import.meta.env.VITE_STREAM_API_KEY!);
    if (chat.tokenManager.token === token && chat.userID === loggedUser.id)
      return;

    let ignore = false;
    const connect = chat.connectUser(loggedUser, token).then(() => {
      if (!ignore) {
        setStreamChat(chat);
      }
    });
    return () => {
      ignore = true;
      setStreamChat(undefined);

      connect.then(() => chat.disconnectUser());
    };
  }, [loggedUser, token]);

  return { login, isLogging: isMutating, loggedUser, token, streamChat };
}

export type AuthContextType = {
  signup: TriggerWithArgs<AxiosResponse<Promise<void>>, unknown, string, User>;
  isSigningUp: boolean;
  login: TriggerWithArgs<
    {
      token: string;
      user: User;
    },
    unknown,
    string,
    string
  >;
  isLogging: boolean;
  loggedUser?: User;
  streamChat?: StreamChat;
};
export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};
const AuthProvider = ({ children }: AuthProviderProps) => {
  const { signup, isSigningUp } = useSignUp();
  const { login, isLogging, loggedUser, streamChat } = useLogin();
  return (
    <AuthContext.Provider
      value={{ signup, isSigningUp, login, isLogging, loggedUser, streamChat }}>
      {children}
    </AuthContext.Provider>
  );
};

export function AuthContextWrapper() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext)!;
}
