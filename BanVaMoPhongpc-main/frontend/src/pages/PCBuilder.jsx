// PC Builder (tương ứng views/client/pc-builder.ejs + public/js/pc-builder-ajax.js).
// Mỗi lần chọn linh kiện, gửi các linh kiện đã chọn lên GET /api/pc-builder.
// Backend (PCBuilderModel) trả về: danh sách lựa chọn đã lọc theo tương thích + cảnh báo.
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, money, imgUrl } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

const idKey = { CPU: "cpuId", Mainboard: "mainboardId", RAM: "ramId", GPU: "gpuId", PSU: "psuId" };

export default function PCBuilder() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [chosen, setChosen] = useState({}); // { CPU: product, Mainboard: product, ... }
  const [data, setData] = useState(null);   // { slots, warnings, options }
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams();
    Object.entries(idKey).forEach(([slot, key]) => chosen[slot] && query.set(key, chosen[slot].id));
    api.get("/pc-builder?" + query).then(setData).catch((e) => setError(e.message));
  }, [chosen]);

  if (error) return <main className="wrap page"><div className="emptyBox">{error}</div></main>;
  if (!data) return <main className="wrap page"><div className="emptyBox">Đang tải...</div></main>;

  function choose(slot, id) {
    const product = data.options[slot].find((p) => p.id === Number(id));
    const next = { ...chosen };
    if (product) next[slot] = product; else delete next[slot];
    setChosen(next);
  }

  const parts = Object.values(chosen);
  const total = parts.reduce((s, p) => s + p.price, 0);
  const complete = parts.length === data.slots.length && data.warnings.length === 0;

  function addAll() {
    parts.forEach((p) => addToCart(p));
    navigate("/cart");
  }

  return (
    <main className="wrap page">
      <p className="crumb"><Link to="/">Trang chủ</Link> / PC Builder</p>
      <div className="titleRow"><div><h1>Xây dựng cấu hình PC</h1><p>Chọn linh kiện, hệ thống tự lọc các linh kiện tương thích.</p></div></div>
      <div className="builder">
        <section>
          {data.warnings.map((w) => <p className="warn" key={w}>⚠ {w}</p>)}
          {data.slots.map((slot, i) => {
            const part = chosen[slot];
            return (
              <div className="buildRow" key={slot}>
                <i>{i + 1}</i><b>{slot}</b>
                <select value={part?.id || ""} onChange={(e) => choose(slot, e.target.value)}>
                  <option value="">-- Chọn {slot} --</option>
                  {data.options[slot].map((p) => <option key={p.id} value={p.id} disabled={p.stock <= 0}>{p.name} - {money(p.price)}{p.stock <= 0 ? " (hết hàng)" : ""}</option>)}
                </select>
                {part && <><img src={imgUrl(part.image)} alt="" /><em>{money(part.price)}</em></>}
              </div>
            );
          })}
        </section>
        <aside className="summary">
          <h3>Tóm tắt cấu hình</h3>
          <p>Linh kiện đã chọn <b>{parts.length}/{data.slots.length}</b></p>
          <p>Còn thiếu <b>{data.slots.length - parts.length} linh kiện</b></p>
          <hr /><span>Tổng cộng</span><strong>{money(total)}</strong>
          <button disabled={!complete} onClick={addAll}>Thêm cấu hình vào giỏ</button>
          <small>{complete ? "Cấu hình hợp lệ" : "Chọn đủ linh kiện tương thích để mua"}</small>
        </aside>
      </div>
    </main>
  );
}
