// Đăng nhập (tương ứng views/client/login.ejs). Gọi login() trong AuthContext -> POST /api/login.
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      // admin vào trang quản trị, khách quay lại trang đang xem (hoặc trang chủ)
      navigate(user.role === "admin" ? "/admin" : location.state?.from || "/");
    } catch (err) { setError(err.message); }
  }

  return (
    <main className="authPage">
      <form onSubmit={submit}>
        <Logo />
        <h1>Đăng nhập</h1>
        <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Mật khẩu<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        {error && <p className="formError">{error}</p>}
        <button className="primary full">Đăng nhập</button>
        <p className="switch">Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
      </form>
    </main>
  );
}
