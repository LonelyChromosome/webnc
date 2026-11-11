// Quản lý sản phẩm (tương ứng views/admin/manage-products.ejs).
// Một form dùng chung cho Thêm và Sửa: bấm "Sửa" thì đổ dữ liệu của dòng đó vào form.
// API: GET/POST /api/admin/products, PUT/DELETE /api/admin/products/:id
import { useEffect, useState } from "react";
import { api, money, imgUrl } from "../../services/api.js";

const CATEGORIES = ["CPU", "GPU", "Mainboard", "RAM", "SSD", "PSU", "PC Build sẵn"];
const empty = { name: "", category: "CPU", brand: "", price: 0, stock: 0, image: "/uploads/cpu.jpg", featured: false, performance: 70 };

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const load = () => api.get("/admin/products").then(setProducts).catch((e) => setMessage({ type: "error", text: e.message }));
  useEffect(() => { load(); }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    try {
      if (editingId) await api.put("/admin/products/" + editingId, form);
      else await api.post("/admin/products", form);
      setMessage({ type: "ok", text: editingId ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm." });
      setForm(empty); setEditingId(null); load();
    } catch (err) { setMessage({ type: "error", text: err.message }); }
  }

  function edit(p) {
    setEditingId(p.id);
    setForm({ name: p.name, category: p.category, brand: p.brand, price: p.price, stock: p.stock, image: p.image, featured: p.featured, performance: p.performance });
    window.scrollTo(0, 0);
  }

  async function remove(p) {
    if (!confirm(`Xóa sản phẩm "${p.name}"?`)) return;
    try { await api.del("/admin/products/" + p.id); load(); } catch (err) { setMessage({ type: "error", text: err.message }); }
  }

  return (
    <>
      <h1>Quản lý sản phẩm</h1>
      {message.text && <p className={message.type === "ok" ? "formOk" : "formError"}>{message.text}</p>}

      <form className="adminForm" onSubmit={submit}>
        <h2>{editingId ? `Sửa sản phẩm #${editingId}` : "Thêm sản phẩm"}</h2>
        <label>Tên sản phẩm<input required value={form.name} onChange={set("name")} /></label>
        <label>Danh mục<select value={form.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>Thương hiệu<input value={form.brand} onChange={set("brand")} /></label>
        <label>Giá bán (₫)<input type="number" min="0" required value={form.price} onChange={set("price")} /></label>
        <label>Tồn kho<input type="number" min="0" required value={form.stock} onChange={set("stock")} /></label>
        <label>Điểm hiệu năng (0-100)<input type="number" min="0" max="100" value={form.performance} onChange={set("performance")} /></label>
        <label className="wide2">Đường dẫn ảnh (file nằm trong public/uploads)<input value={form.image} onChange={set("image")} placeholder="/uploads/cpu.jpg" /></label>
        <label className="check"><input type="checkbox" checked={form.featured} onChange={set("featured")} /> Hiển thị ở mục nổi bật</label>
        <div className="formBtns">
          <button className="primary">{editingId ? "Lưu thay đổi" : "Thêm sản phẩm"}</button>
          {editingId && <button type="button" className="ghost" onClick={() => { setEditingId(null); setForm(empty); }}>Hủy sửa</button>}
        </div>
      </form>

      <div className="tableBox">
        <div><h2>{products.length} sản phẩm</h2></div>
        <div className="scroll"><table>
          <thead><tr><th></th><th>TÊN SẢN PHẨM</th><th>DANH MỤC</th><th>GIÁ BÁN</th><th>TỒN KHO</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><img className="thumb" src={imgUrl(p.image)} alt="" /></td>
                <td><b>{p.name}</b><br /><small>{p.brand}</small></td><td>{p.category}</td><td>{money(p.price)}</td>
                <td><span className={p.stock <= 5 ? "low" : ""}>{p.stock}</span></td>
                <td className="acts"><button onClick={() => edit(p)}>Sửa</button><button className="danger" onClick={() => remove(p)}>Xóa</button></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </>
  );
}
