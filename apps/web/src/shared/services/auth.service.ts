import { api } from "@/shared/lib/axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  getProfile: async (): Promise<AuthResponse["user"]> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
