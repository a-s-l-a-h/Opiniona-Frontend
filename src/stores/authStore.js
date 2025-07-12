// src/stores/authStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      token: null,
      user: null, // user object can contain { id, username, is_staff }
      isAuthenticated: false,
      isStaff: false,
      
      // Actions
      login: async (username, password) => {
        try {
          const response = await apiClient.post('/accounts/login/', { username, password });
          const { token, user_id, is_staff } = response.data;
          
          set({ 
            token, 
            user: { id: user_id, username, is_staff }, 
            isAuthenticated: true,
            isStaff: is_staff
          });
          return { success: true };
        } catch (error) {
          console.error("Login failed:", error.response?.data);
          return { success: false, error: error.response?.data };
        }
      },

      register: async (username, email, password, password2) => {
        try {
          await apiClient.post('/accounts/register/', { username, email, password, password2 });
          // Automatically log in the user after successful registration
          return await get().login(username, password);
        } catch (error) {
          console.error("Registration failed:", error.response?.data);
          return { success: false, error: error.response?.data };
        }
      },

      logout: async () => {
        try {
          // Tell the backend to invalidate the token
          await apiClient.post('/accounts/logout/');
        } catch (error) {
          console.error("Logout API call failed, logging out client-side anyway.", error);
        } finally {
          // Always clear client-side state
          set({ token: null, user: null, isAuthenticated: false, isStaff: false });
        }
      },
    }),
    {
      name: 'auth-storage', // name of the item in storage (must be unique)
    }
  )
);