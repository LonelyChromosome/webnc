// Khung trang quản trị: thanh bên + nội dung. Chỉ admin mới vào được (khác thì chuyển về trang đăng nhập).
// Backend cũng kiểm tra lại bằng requireAdmin, nên đây chỉ là để giao diện gọn gàng.
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  if (loading) return null;
  if (!user || user.role !== "admin") return <Navigate to="/login" state={{ from: "/admin" }} replace />;

  return (
    <main className="admin">
      <AdminSidebar />
      <section>
        <header><b>Quản trị KaDa Store</b><span>{user.name} &nbsp; • &nbsp; <button className="link" onClick={logout}>Đăng xuất</button></span></header>
        <div className="adminBody"><Outlet /></div>
      </section>
    </main>
  );
}
