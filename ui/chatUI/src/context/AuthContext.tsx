import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios, { AxiosResponse } from "axios";
// import useSWR from "swr";
import useSWRMutation, {
  TriggerWithArgs,
  TriggerWithoutArgs,
} from "swr/mutation";
import { Outlet, useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import { useLocalStorage } from "../hooks/useLocalStorage";

export type User = {
  id: string;
  name: string;
  image?: string;
};

const cacheKey = `${import.meta.env.VITE_SERVER_URL}/users`;

export function useSignUp() {
  const navigate = useNavigate();
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
  const [loggedUser, setLoggedUser] = useLocalStorage<User>("user");
  const [token, setToken] = useLocalStorage<string>("token");
  const [streamChat, setStreamChat] = useState<StreamChat>();
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

  const { trigger: logout, isMutating: isLoggingOut } = useSWRMutation(
    cacheKey,
    async () => {
      return await axios.post(`${cacheKey}/logout`, { token });
    },
    {
      onSuccess: () => {
        setToken(undefined);
        setLoggedUser(undefined);
        setStreamChat(undefined);
      },
    }
  );

  return {
    login,
    isLogging: isMutating,
    logout,
    isLoggingOut,
    loggedUser,
    token,
    streamChat,
  };
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
  logout: TriggerWithoutArgs<AxiosResponse<Promise<void>>, unknown, string>;
  isLoggingOut: boolean;
  loggedUser?: User;
  streamChat?: StreamChat;
};
export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};
const AuthProvider = ({ children }: AuthProviderProps) => {
  const { signup, isSigningUp } = useSignUp();
  const { login, isLogging, logout, isLoggingOut, loggedUser, streamChat } =
    useLogin();
  return (
    <AuthContext.Provider
      value={{
        signup,
        isSigningUp,
        login,
        isLogging,
        logout,
        isLoggingOut,
        loggedUser,
        streamChat,
      }}>
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

export function useLoggedAuth() {
  return useContext(AuthContext) as AuthContextType &
    Required<Pick<AuthContextType, "loggedUser">>;
}
