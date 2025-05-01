import { createContext } from 'react';

/**
 * Auth context for managing authentication state throughout the app
 * Provides:
 * - isAuthenticated: Boolean indicating if user is logged in
 * - user: User information (username)
 * - login: Function to set auth state on successful login
 * - logout: Function to clear auth state
 */
export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {}
});