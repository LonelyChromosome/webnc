// Thẻ sản phẩm, dùng ở trang chủ và trang danh sách.
import { Link } from "react-router-dom";
import { money, imgUrl } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const inStock = product.stock > 0;
  return (
    <article className="product">
      <Link className="photo" to={`/products/${product.id}`}><img src={imgUrl(product.image)} alt={product.name} loading="lazy" /></Link>
      <div className="productBody">
        <small>{product.category} • {product.brand}</small>
        <Link className="productName" to={`/products/${product.id}`}>{product.name}</Link>
        <b className="price">{money(product.price)}</b>
        <span className={"stock" + (inStock ? "" : " out")}>● {inStock ? `Còn ${product.stock} sản phẩm` : "Hết hàng"}</span>
        <div className="productActions">
          <Link to={`/products/${product.id}`} className="detailBtn">Xem chi tiết</Link>
          <button disabled={!inStock} onClick={() => addToCart(product)}>Thêm vào giỏ</button>
        </div>
      </div>
    </article>
  );
}
