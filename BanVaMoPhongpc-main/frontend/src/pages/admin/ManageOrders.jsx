// Quản lý đơn hàng (tương ứng views/admin/manage-orders.ejs).
// GET /api/admin/orders lấy danh sách; PUT /api/admin/orders/:id/status đổi trạng thái.
import { useEffect, useState } from "react";
import { api, money } from "../../services/api.js";

const STATUSES = ["Chờ duyệt", "Đang giao", "Hoàn tất", "Đã hủy"];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const load = () => api.get("/admin/orders").then(setOrders).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  async function changeStatus(id, status) {
    try { await api.put(`/admin/orders/${id}/status`, { status }); load(); } catch (err) { setError(err.message); }
  }

  return (
    <>
      <h1>Quản lý đơn hàng</h1>
      {error && <p className="formError">{error}</p>}
      <div className="tableBox"><div className="scroll"><table>
        <thead><tr><th>MÃ</th><th>KHÁCH HÀNG</th><th>SẢN PHẨM</th><th>GIAO ĐẾN</th><th>TỔNG TIỀN</th><th>TRẠNG THÁI</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td><b>#{o.id}</b><br /><small>{o.created_at}</small></td>
              <td>{o.customer_name}<br /><small>{o.phone}</small></td>
              <td>{o.items.map((i) => <div key={i.id}>{i.product_name} × {i.quantity}</div>)}</td>
              <td>{o.address}</td>
              <td>{money(o.total)}</td>
              <td>
                <select className="statusSel" value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {!orders.length && <tr><td colSpan={6} className="none">Chưa có đơn hàng nào.</td></tr>}
        </tbody>
      </table></div></div>
    </>
  );
}
