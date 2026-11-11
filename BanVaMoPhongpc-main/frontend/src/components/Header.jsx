// Đầu trang: logo, ô tìm kiếm, tài khoản, giỏ hàng và thanh menu (tương ứng views/partials/header.ejs).
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import Logo from "./Logo.jsx";

const icons = {
  search: "M21 21l-4.4-4.4m2.4-5.1a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z",
  user: "M20 21a8 8 0 00-16 0m8-9a4 4 0 100-8 4 4 0 000 8z",
  cart: "M3 3h2l2.4 10.2a2 2 0 002 1.5h8.8a2 2 0 002-1.6L22 6H6M10 20h.01M18 20h.01",
  menu: "M4 7h16M4 12h16M4 17h16",
};
const Icon = ({ name }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icons[name]} /></svg>;

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);

  const search = (e) => {
    e.preventDefault();
    navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  const here = location.pathname + location.search;
  const links = [
    ["/", "Trang chủ"],
    ["/products", "Linh kiện PC"],
    ["/products?category=PC Build sẵn", "PC Build sẵn"],
    ["/pc-builder", "PC Builder"],
  ];
  if (user?.role === "admin") links.push(["/admin", "Quản trị"]);
  const isActive = (to) => (to === "/products" ? location.pathname === "/products" && !location.search.includes("Build") : decodeURIComponent(here) === to);

  return (
    <header>
      <div className="wrap head">
        <Link className="brand" to="/" aria-label="KaDa Store"><Logo /></Link>
        <form className="search" onSubmit={search}>
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Bạn cần tìm linh kiện, PC hay phụ kiện?" />
          <button aria-label="Tìm kiếm"><Icon name="search" /></button>
        </form>

        {user ? (
          <div className="accountWrap">
            <button className="headAction" onClick={() => setOpen(!open)}><Icon name="user" /><span>Xin chào<small>{user.name}</small></span></button>
            {open && (
              <div className="dropdown" onMouseLeave={() => setOpen(false)}>
                <button onClick={() => { setOpen(false); navigate("/orders"); }}>Đơn hàng của tôi</button>
                {user.role === "admin" && <button onClick={() => { setOpen(false); navigate("/admin"); }}>Trang quản trị</button>}
                <button onClick={() => { setOpen(false); logout(); navigate("/"); }}>Đăng xuất</button>
              </div>
            )}
          </div>
        ) : (
          <Link className="headAction" to="/login"><Icon name="user" /><span>Tài khoản<small>Đăng nhập</small></span></Link>
        )}

        <Link className="headAction" to="/cart"><Icon name="cart" /><span>Giỏ hàng<small>{count} sản phẩm</small></span></Link>
      </div>
      <nav className="wrap">
        <Link to="/products"><Icon name="menu" /> DANH MỤC SẢN PHẨM</Link>
        {links.map(([to, label]) => <Link key={to} to={to} className={isActive(to) ? "active" : ""}>{label}</Link>)}
      </nav>
    </header>
  );
}
