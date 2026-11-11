// Chi tiết sản phẩm (tương ứng views/client/product-detail.ejs). Gọi GET /api/products/:id.
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, money, imgUrl, specLabels } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams(); // lấy :id từ địa chỉ
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setProduct(null); setQty(1);
    api.get("/products/" + id).then(setProduct).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <main className="wrap page"><div className="emptyBox">{error}</div></main>;
  if (!product) return <main className="wrap page"><div className="emptyBox">Đang tải...</div></main>;

  const inStock = product.stock > 0;
  return (
    <main className="wrap page">
      <p className="crumb"><Link to="/">Trang chủ</Link> / <Link to={`/products?category=${product.category}`}>{product.category}</Link> / {product.name}</p>
      <section className="detail">
        <div className="gallery"><img src={imgUrl(product.image)} alt={product.name} /></div>
        <div className="buy">
          <small>{product.brand} • Mã sản phẩm: KD-{String(product.id).padStart(4, "0")}</small>
          <h1>{product.name}</h1>
          <b className="bigPrice">{money(product.price)}</b>
          <p className={"available" + (inStock ? "" : " out")}>{inStock ? `✓ Còn ${product.stock} sản phẩm • Giao nhanh 2 giờ nội thành` : "Tạm hết hàng"}</p>
          <div className="quantity">
            <span>Số lượng</span>
            <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><b>{qty}</b><button onClick={() => setQty(Math.min(product.stock || 1, qty + 1))}>+</button>
          </div>
          <button className="addBig" disabled={!inStock} onClick={() => addToCart(product, qty)}>THÊM VÀO GIỎ HÀNG <small>Giao hàng toàn quốc</small></button>
          <div className="benefits"><span>✓ Bảo hành chính hãng</span><span>✓ Đổi mới trong 7 ngày</span><span>✓ Hỗ trợ kỹ thuật trọn đời</span></div>
        </div>
      </section>
      <section className="spec">
        <h2>Thông số kỹ thuật</h2>
        <table><tbody>
          <tr><td>Nhà sản xuất</td><td>{product.brand}</td></tr>
          <tr><td>Danh mục</td><td>{product.category}</td></tr>
          {Object.entries(product.specs).map(([k, v]) => <tr key={k}><td>{specLabels[k] || k}</td><td>{v}</td></tr>)}
          <tr><td>Bảo hành</td><td>36 tháng chính hãng</td></tr>
        </tbody></table>
      </section>
    </main>
  );
}
