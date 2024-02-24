import { ReactNode, createContext, useContext } from "react";

import axios, { AxiosResponse } from "axios";
// import useSWR from "swr";
import useSWRMutation, {
  TriggerWithArgs,
  TriggerWithoutArgs,
} from "swr/mutation";
import { Outlet, useNavigate } from "react-router-dom";

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

export type AuthContextType = {
  signup: TriggerWithArgs<AxiosResponse<Promise<void>>, unknown, string, User>;
  isSigningUp: boolean;
};
export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};
const AuthProvider = ({ children }: AuthProviderProps) => {
  const { signup, isSigningUp } = useSignUp();
  return (
    <AuthContext.Provider value={{ signup, isSigningUp }}>
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
