// Giỏ hàng + đặt hàng (tương ứng views/client/cart.ejs).
// Bấm "Đặt hàng" -> POST /api/checkout (CartController.checkout). Cần đăng nhập, token được gắn tự động.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, money, imgUrl } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { user } = useAuth();
  const { items, total, setQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", address: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [busy, setBusy] = useState(false);

  async function checkout(e) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const data = await api.post("/checkout", { items: items.map((i) => ({ id: i.id, quantity: i.quantity })), ...form });
      clearCart();
      setDone(`${data.message} Mã đơn: #${data.orderId}`);
    } catch (err) { setError(err.message); }
    setBusy(false);
  }

  if (done) {
    return (
      <main className="wrap page"><div className="success">
        <h1>Đặt hàng thành công</h1><p>{done}</p>
        <div><Link className="primary ghostLink" to="/orders">Xem đơn hàng của tôi</Link><Link className="ghost" to="/">Tiếp tục mua sắm</Link></div>
      </div></main>
    );
  }

  return (
    <main className="wrap page">
      <p className="crumb"><Link to="/">Trang chủ</Link> / Giỏ hàng</p>
      <h1>Giỏ hàng của bạn</h1>
      <div className="cartPage">
        <section>
          <div className="cartHeader">SẢN PHẨM <span>ĐƠN GIÁ &nbsp;&nbsp;&nbsp; SỐ LƯỢNG &nbsp;&nbsp;&nbsp; THÀNH TIỀN</span></div>
          {items.length ? items.map((i) => (
            <article key={i.id}>
              <img src={imgUrl(i.image)} alt="" />
              <span><b>{i.name}</b><small>Bảo hành chính hãng</small><button className="link" onClick={() => removeItem(i.id)}>Xóa</button></span>
              <em>{money(i.price)}</em>
              <div className="qty"><button onClick={() => setQuantity(i.id, i.quantity - 1)}>−</button><b>{i.quantity}</b><button onClick={() => setQuantity(i.id, i.quantity + 1)}>+</button></div>
              <strong>{money(i.price * i.quantity)}</strong>
            </article>
          )) : <div className="empty">Giỏ hàng chưa có sản phẩm.</div>}
        </section>

        <form className="summary" onSubmit={checkout}>
          <h3>Tóm tắt đơn hàng</h3>
          <p>Tạm tính <b>{money(total)}</b></p><p>Phí vận chuyển <b>Miễn phí</b></p>
          <hr /><span>Tổng thanh toán</span><strong>{money(total)}</strong>
          {items.length > 0 && (
            <div className="checkoutBox">
              <label>Số điện thoại<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
              <label>Địa chỉ nhận hàng<input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
            </div>
          )}
          {error && <p className="formError">{error}</p>}
          <button
            type={user ? "submit" : "button"}
            disabled={!items.length || busy}
            onClick={() => { if (!user) navigate("/login", { state: { from: "/cart" } }); }}
          >{busy ? "ĐANG ĐẶT HÀNG..." : user ? "ĐẶT HÀNG" : "ĐĂNG NHẬP ĐỂ ĐẶT HÀNG"}</button>
          <small>Thanh toán khi nhận hàng • Xuất hóa đơn VAT</small>
        </form>
      </div>
    </main>
  );
}
