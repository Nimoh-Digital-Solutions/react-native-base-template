import axios from 'axios';
import { http } from '@/services/http';
import { loginResponseSchema, userSchema, registerResponseSchema } from '@shared/schemas/user.schema';
import type { User, LoginResponse, RegisterResponse } from '@shared/types/user';
import type { LoginInput, RegisterBaseInput, ForgotPasswordInput, ChangePasswordInput } from '@shared/schemas/auth.schema';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const mobileHeaders = { 'X-Client-Type': 'mobile' };

export const authApi = {
  login: async (input: LoginInput): Promise<LoginResponse> => {
    const { data } = await axios.post(
      `${API_URL}/auth/login/`,
      { email_or_username: input.email_or_username, password: input.password },
      { headers: mobileHeaders },
    );
    const parsed = loginResponseSchema.parse(data);
    return {
      access_token: parsed.access_token,
      refresh_token: parsed.refresh_token ?? '',
      token_type: parsed.token_type,
      expires_in: parsed.expires_in,
      user: parsed.user,
    };
  },

  register: async (input: Omit<RegisterBaseInput, 'password_confirm'>): Promise<RegisterResponse> => {
    const { data } = await axios.post(
      `${API_URL}/auth/register/`,
      {
        username: input.username,
        email: input.email,
        first_name: input.first_name || '',
        last_name: input.last_name || '',
        password: input.password,
        password_confirm: input.password,
        privacy_policy_accepted: true,
        terms_of_service_accepted: true,
        ...(input.role !== undefined ? { role: input.role } : {}),
      },
      { headers: mobileHeaders },
    );
    return registerResponseSchema.parse(data);
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await axios.post(
      `${API_URL}/auth/token/refresh/`,
      {},
      {
        headers: {
          ...mobileHeaders,
          'X-Refresh-Token': refreshToken,
        },
      },
    );
    return {
      access_token: data.access as string,
      refresh_token: (data.refresh as string) || refreshToken,
    };
  },

  logout: async (refreshToken: string): Promise<void> => {
    try {
      await http.post('/auth/logout/', { refresh: refreshToken });
    } catch {
      // Fire-and-forget: logout should succeed locally even if API call fails
    }
  },

  getMe: async (signal?: AbortSignal): Promise<User> => {
    const { data } = await http.get('/auth/me/', { signal });
    return userSchema.parse(data);
  },

  forgotPassword: async (input: ForgotPasswordInput): Promise<void> => {
    await axios.post(`${API_URL}/auth/password/reset/`, input, {
      headers: mobileHeaders,
    });
  },

  changePassword: async (input: Omit<ChangePasswordInput, 'confirm_new_password'>): Promise<void> => {
    await http.post('/auth/password/change/', {
      old_password: input.current_password,
      new_password: input.new_password,
    });
  },

  googleSignIn: async (idToken: string): Promise<LoginResponse> => {
    const { data } = await axios.post(
      `${API_URL}/auth/social/google-mobile/`,
      { id_token: idToken },
      { headers: mobileHeaders },
    );
    return loginResponseSchema.parse(data) as LoginResponse;
  },
};
