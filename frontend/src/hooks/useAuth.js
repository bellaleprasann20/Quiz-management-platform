// frontend/src/hooks/useAuth.js
import { useAuth as useAuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication state and methods.
 * Provides: user, token, isAuthenticated, isLoading, login, logout
 */
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;