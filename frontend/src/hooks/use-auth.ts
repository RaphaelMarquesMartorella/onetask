"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "@/types";

export function useAuth() {
  const router = useRouter();
  const { setAuth, logout: storeLogout, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>("/api/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token);
      toast.success("Login realizado com sucesso!");
      router.push("/");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail || "Erro ao fazer login. Verifique suas credenciais.";
      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>("/api/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token);
      toast.success("Conta criada com sucesso!");
      router.replace("/");
      router.refresh();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail || "Erro ao criar conta. Tente novamente.";
      toast.error(message);
    },
  });

  const getMeMutation = useMutation({
    mutationFn: async (): Promise<User> => {
      const response = await api.get<User>("/api/auth/me");
      return response.data;
    },
  });

  const logout = () => {
    storeLogout();
    toast.success("Logout realizado com sucesso!");
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    getMe: getMeMutation.mutate,
    logout,
  };
}
