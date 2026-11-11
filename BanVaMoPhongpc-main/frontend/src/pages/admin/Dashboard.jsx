// Tổng quan quản trị (tương ứng views/admin/dashboard.ejs). Gọi GET /api/admin (AdminController.dashboard).
import { useEffect, useState } from "react";
import { api, money } from "../../services/api.js";

export default function Dashboard() {
  const [d, setD] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api.get("/admin").then(setD).catch((e) => setError(e.message)); }, []);

  if (error) return <div className="emptyBox">{error}</div>;
  if (!d) return <div className="emptyBox">Đang tải...</div>;

  const cards = [
    ["Doanh thu", money(d.revenue), "Không tính đơn đã hủy"],
    ["Tổng đơn hàng", d.orders, `${d.customers} khách hàng`],
    ["Đơn chờ duyệt", d.pending, "Cần xử lý"],
    ["Sản phẩm", d.products, `${d.lowStock} sắp hết hàng`],
  ];
  return (
    <>
      <h1>Tổng quan</h1>
      <div className="stats">{cards.map((c) => <article key={c[0]}><span>{c[0]}</span><b>{c[1]}</b><small>{c[2]}</small></article>)}</div>
      <div className="tableBox">
        <div><h2>Đơn hàng gần đây</h2></div>
        <div className="scroll"><table>
          <thead><tr><th>MÃ ĐƠN</th><th>KHÁCH HÀNG</th><th>SẢN PHẨM</th><th>TỔNG TIỀN</th><th>TRẠNG THÁI</th></tr></thead>
          <tbody>
            {d.recentOrders.map((o) => <tr key={o.id}><td>#{o.id}</td><td>{o.customer_name}</td><td>{o.items.map((i) => i.product_name).join(", ")}</td><td>{money(o.total)}</td><td><span className="status">{o.status}</span></td></tr>)}
            {!d.recentOrders.length && <tr><td colSpan={5} className="none">Chưa có đơn hàng nào.</td></tr>}
          </tbody>
        </table></div>
      </div>
    </>
  );
}
