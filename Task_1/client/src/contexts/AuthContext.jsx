import { createContext, useContext, useState, useEffect } from 'react';
import { backendServices, checkApiHealth, getToken, setToken, clearToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiHealth().then((apiOk) => {
      if (!apiOk) {
        setUser(null);
        setLoading(false);
        return;
      }
      if (!getToken()) {
        setUser(null);
        setLoading(false);
        return;
      }
      backendServices
        .getMe()
        .then((res) => {
          if (res?.success && res?.data) setUser(res.data);
          else setUser(null);
        })
        .catch(() => {
          clearToken();
          setUser(null);
        })
        .finally(() => setLoading(false));
    });
  }, []);

  const login = async (username, password) => {
    const res = await backendServices.login(username, password);
    if (res?.success && res?.data?.user) {
      setUser(res.data.user);
      if (res.data.token) setToken(res.data.token);
      return res;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const register = async (data) => {
    const res = await backendServices.register(data);
    if (res?.success && res?.data?.user) {
      setUser(res.data.user);
      if (res.data.token) setToken(res.data.token);
      return res;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
