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
  // TODO: handle JWT expiry. Backend cookie lives 30 min with no refresh, so
  // after an idle session `user` stays populated while authenticated API calls
  // start returning 401. Needs either silent refresh or a 401-driven sign-out
  // that clears this state and redirects to /identity/login.
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
