"use client";
import { IUserContext, User } from "@/types/types";
import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext<IUserContext>({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  setUser: (value: User | null) => {},
});

export function AuthProvider({
  children,
  initialUser,
}: {
  children: any;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);

  // Memoize the value to prevent unnecessary re-renders of all consumers
  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      isLoading: false,
      setUser,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
