// Lưu thông tin đăng nhập cho toàn bộ ứng dụng. Component nào cũng gọi useAuth() để lấy user / login / logout.
// Luồng JWT: login() gọi POST /api/login -> nhận token -> lưu localStorage -> mỗi request sau tự gắn token (services/api.js).
import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "../services/api.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // đang kiểm tra token cũ

  // Mở lại trang: nếu có token cũ thì hỏi backend xem còn hợp lệ không
  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    api.get("/me").then((r) => setUser(r.user)).catch(() => setToken(null)).finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.post("/login", { email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const data = await api.post("/register", { name, email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
