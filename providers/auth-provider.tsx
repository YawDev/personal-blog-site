"use client";
import { RefreshTokenApi } from "@/service/PersonalBlogService";
import { IUserContext, RefreshTokenResponse, User } from "@/types/types";
import apiClient from "@/utils/browser/apiClient";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

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
  const router = useRouter();
  // Holds an in-flight refresh promise so parallel 401s share one refresh call
  const refreshPromise = useRef<Promise<RefreshTokenResponse> | null>(null);

  useEffect(() => {
    const interceptorId = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;
        const isRefreshRequest = original?.url?.includes("/api/auth/refresh");

        if (error.response?.status === 401 && !original._retry && !isRefreshRequest) {
          original._retry = true;

          try {
            if (!refreshPromise.current) {
              refreshPromise.current = RefreshTokenApi(null).finally(() => {
                refreshPromise.current = null;
              });
            }

            const res = await refreshPromise.current;

            if (res.status === 200 && res.data) {
              setUser(res.data);
              return apiClient(original);
            }
          } catch {}

          setUser(null);
          router.push("/identity/login");
        }

        return Promise.reject(error);
      },
    );

    return () => {
      apiClient.interceptors.response.eject(interceptorId);
    };
  }, [setUser, router]);

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
