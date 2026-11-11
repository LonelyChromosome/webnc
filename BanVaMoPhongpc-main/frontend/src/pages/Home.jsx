// Trang chủ (tương ứng views/client/home.ejs). Dữ liệu lấy từ GET /api/home (HomeController.index).
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, money, imgUrl } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const { addToCart } = useCart();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { api.get("/home").then(setData).catch((e) => setError(e.message)); }, []);

  if (error) return <main className="wrap page"><div className="emptyBox">{error}</div></main>;
  if (!data) return <main className="wrap page"><div className="emptyBox">Đang tải dữ liệu...</div></main>;

  const parts = data.categories.filter((c) => c !== "PC Build sẵn");

  return (
    <>
      <section className="hero">
        <div className="wrap heroInner">
          <div>
            <span className="eyebrow">NÂNG CẤP HIỆU NĂNG • TỐI ƯU CHI PHÍ</span>
            <h1>XÂY DỰNG BỘ PC<br />PHÙ HỢP VỚI BẠN</h1>
            <p>Linh kiện chính hãng, cấu hình đa dạng, dễ dàng lựa chọn và nâng cấp.</p>
            <div>
              <Link className="primary" to="/products" style={{ display: "inline-grid", placeItems: "center" }}>Khám phá sản phẩm</Link>
              <Link className="outline" to="/pc-builder">Tự build PC</Link>
            </div>
          </div>
          <img src={imgUrl("/uploads/pc-100tr.jpg")} alt="Máy tính chơi game hiệu năng cao" />
        </div>
      </section>

      <main className="wrap">
        <section className="category">
          <div className="sectionHead"><div><small>DANH MỤC</small><h2>Linh kiện máy tính</h2></div><Link to="/products">Xem tất cả →</Link></div>
          <div className="catRow" style={{ gridTemplateColumns: `repeat(${parts.length}, 1fr)` }}>
            {parts.map((c) => <Link key={c} to={`/products?category=${c}`}><span>{c.slice(0, 3).toUpperCase()}</span>{c}</Link>)}
          </div>
        </section>

        <section>
          <div className="sectionHead"><div><small>ĐỀ XUẤT HÔM NAY</small><h2>Sản phẩm nổi bật</h2></div><span className="note">Cam kết chính hãng 100%</span></div>
          <div className="grid">{data.featured.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section className="prebuilt">
          <div className="sectionHead light"><div><small>CẤU HÌNH ĐÃ TỐI ƯU</small><h2>PC Build sẵn theo phân khúc</h2></div></div>
          <div className="buildGrid buildGrid4">
            {data.builds.map((b) => (
              <article key={b.id}>
                <img src={imgUrl(b.image)} alt={b.name} />
                <div>
                  <span className="tierTag">{b.specs.tier}</span>
                  <h3>{b.name}</h3>
                  <p>{b.specs.cpu} • {b.specs.gpu} • {b.specs.ram} • {b.specs.ssd}</p>
                  <b>{money(b.price)}</b>
                  <div><Link to={`/products/${b.id}`}>Xem cấu hình</Link><button onClick={() => addToCart(b)}>Thêm vào giỏ hàng</button></div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
