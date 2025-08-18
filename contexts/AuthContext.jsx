// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { api, setAccessToken as setApiAccessToken } from "../utils/api"; // <-- rename import

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, try refresh (httpOnly cookie) then /me
  useEffect(() => {
    (async () => {
      try {
        const r = await api.post("/auth/refresh");
        setApiAccessToken(r.data.accessToken);
        const me = await api.get("/auth/me");
        setUser(me.data.user);
      } catch {
        setApiAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (creds) => {
    const { data } = await api.post("/auth/login", creds);
    setApiAccessToken(data.accessToken);
    setUser(data.user);
  };

  const signup = async (creds) => {
    const { data } = await api.post("/auth/signup", creds);
    setApiAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setApiAccessToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}