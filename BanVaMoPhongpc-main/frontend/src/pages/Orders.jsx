// Lịch sử đơn hàng của người dùng. Gọi GET /api/orders/mine (CartController.myOrders).
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, money } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Orders() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState(null);

  useEffect(() => { if (user) api.get("/orders/mine").then(setOrders).catch(() => setOrders([])); }, [user]);

  if (loading) return null;
  if (!user) return <main className="wrap page"><div className="success"><h1>Đơn hàng của tôi</h1><p>Vui lòng đăng nhập để xem đơn hàng.</p><div><Link className="ghostLink" to="/login">Đăng nhập</Link></div></div></main>;

  return (
    <main className="wrap page">
      <p className="crumb"><Link to="/">Trang chủ</Link> / Đơn hàng của tôi</p>
      <h1>Đơn hàng của tôi</h1>
      {orders === null ? <div className="emptyBox">Đang tải...</div> : !orders.length ? <div className="emptyBox">Bạn chưa có đơn hàng nào.</div> : orders.map((o) => (
        <section className="orderCard" key={o.id}>
          <header><b>#{o.id}</b><span>{o.created_at}</span><span className="status">{o.status}</span></header>
          {o.items.map((it) => <div className="orderLine" key={it.id}><span>{it.product_name}<small>x{it.quantity}</small></span><b>{money(it.price * it.quantity)}</b></div>)}
          <footer>Tổng cộng: <strong>{money(o.total)}</strong></footer>
        </section>
      ))}
    </main>
  );
}
