// Danh sách sản phẩm (tương ứng views/client/products.ejs).
// Bộ lọc nằm trên địa chỉ: /products?category=CPU&keyword=intel -> gửi lên GET /api/products (ProductController.list).
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Products() {
  const [params] = useSearchParams();
  const category = params.get("category") || "";
  const keyword = params.get("keyword") || "";
  const [data, setData] = useState({ products: [], categories: [] });
  const [sort, setSort] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams({ category, keyword }).toString();
    api.get("/products?" + query).then(setData).catch((e) => setError(e.message));
  }, [category, keyword]);

  // Sắp xếp giá ngay trên trình duyệt
  const list = [...data.products];
  if (sort === "asc") list.sort((a, b) => a.price - b.price);
  if (sort === "desc") list.sort((a, b) => b.price - a.price);

  return (
    <main className="wrap page">
      <p className="crumb"><Link to="/">Trang chủ</Link> / {category || "Linh kiện máy tính"}</p>
      <div className="titleRow">
        <div>
          <h1>{keyword ? `Kết quả cho "${keyword}"` : category || "Linh kiện máy tính"}</h1>
          <p>{list.length} sản phẩm chính hãng, bảo hành toàn quốc</p>
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sắp xếp: Mặc định</option><option value="asc">Giá thấp đến cao</option><option value="desc">Giá cao đến thấp</option>
        </select>
      </div>
      <div className="catalog">
        <aside>
          <h3>Bộ lọc sản phẩm</h3>
          <label>Danh mục</label>
          <Link className={!category ? "on" : ""} to="/products">Tất cả<span>›</span></Link>
          {data.categories.map((c) => <Link key={c} className={category === c ? "on" : ""} to={`/products?category=${c}`}>{c}<span>›</span></Link>)}
        </aside>
        <section className="results">
          {error ? <div className="emptyBox">{error}</div> : list.length ? <div className="grid">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div> : <div className="emptyBox">Không tìm thấy sản phẩm phù hợp.</div>}
        </section>
      </div>
    </main>
  );
}
