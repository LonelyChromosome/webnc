// Đăng ký (tương ứng views/client/register.ejs). Gọi register() -> POST /api/register, đăng ký xong tự đăng nhập.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) { setError(err.message); }
  }
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <main className="authPage">
      <form onSubmit={submit}>
        <Logo />
        <h1>Tạo tài khoản</h1>
        <label>Họ và tên<input required value={form.name} onChange={set("name")} /></label>
        <label>Email<input type="email" required value={form.email} onChange={set("email")} /></label>
        <label>Mật khẩu<input type="password" required minLength={6} value={form.password} onChange={set("password")} /></label>
        {error && <p className="formError">{error}</p>}
        <button className="primary full">Đăng ký</button>
        <p className="switch">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
      </form>
    </main>
  );
}
