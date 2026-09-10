// server-safe re-export of browser-only auth helpers

import {
  getToken,
  setToken,
  clearTokens,
  getRole,
  isAuthenticated,
  authApi,
} from "./auth-client";

export {
  getToken,
  setToken,
  clearTokens,
  getRole,
  isAuthenticated,
  authApi,
};
