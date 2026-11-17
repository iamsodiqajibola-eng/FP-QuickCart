import { createContext, useContext } from "react";
import type { AuthResponse, User } from "../types/api";

// What the register form sends
export type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

export type AuthContextValue = {
  user: User | null;
  checking: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  setUser: (user: User) => void;
  startSession: (auth: AuthResponse) => User;
};

// null until AuthProvider gives it a value
export const AuthContext = createContext<AuthContextValue | null>(null);

// The hook every component uses
export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error(
      "useAuth must be used inside <AuthProvider> (see main.tsx)",
    );
  }

  return value;
};
