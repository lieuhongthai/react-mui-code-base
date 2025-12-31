import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import type { LoginCredentials } from '@/services/authService';
import type { UserRole } from '@/types/user';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    login: setLogin,
    logout: setLogout,
    setLoading,
    hasRole,
    hasAnyRole,
  } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setLoading(true);
        const response = await authService.login(credentials);
        setLogin(response.user);
        return response;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    [setLogin, setLoading]
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setLogout();
    } catch (error) {
      // Logout locally even if API call fails
      setLogout();
      throw error;
    }
  }, [setLogout, setLoading]);

  const checkRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      return hasRole(role);
    },
    [hasRole]
  );

  const checkAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      return hasAnyRole(roles);
    },
    [hasAnyRole]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole: checkRole,
    hasAnyRole: checkAnyRole,
  };
};
