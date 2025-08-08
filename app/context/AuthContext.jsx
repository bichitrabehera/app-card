import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { API_URL } from "../../constants/api";
import { useRouter } from "expo-router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync("token");
      const storedEmail = await SecureStore.getItemAsync("email");
      if (storedToken) {
        setToken(storedToken);
        setUserEmail(storedEmail);
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);

      const res = await axios.post(`${API_URL}/auth/login`, form.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token } = res.data;
      await SecureStore.setItemAsync("token", access_token);
      await SecureStore.setItemAsync("email", email);

      setToken(access_token);
      setUserEmail(email);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err;
    }
  };

  const register = async (data) => {
    try {
      await axios.post(`${API_URL}/auth/register`, data);
      return await login(data.email, data.password);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("email");
      setToken(null);
      setUserEmail(null);
      router.replace("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, userEmail, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
