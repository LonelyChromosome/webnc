// Thanh bên của trang quản trị (tương ứng views/partials/admin_sidebar.ejs).
import { NavLink, Link } from "react-router-dom";
import Logo from "./Logo.jsx";

export default function AdminSidebar() {
  const items = [["/admin", "Tổng quan", true], ["/admin/products", "Sản phẩm"], ["/admin/orders", "Đơn hàng"]];
  return (
    <aside>
      <div className="brand"><Logo light sub="ADMIN" /></div>
      {items.map(([to, label, end]) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => "sideLink" + (isActive ? " on" : "")}>{label}<span>›</span></NavLink>
      ))}
      <Link className="sideLink toStore" to="/">← Về cửa hàng</Link>
    </aside>
  );
}
