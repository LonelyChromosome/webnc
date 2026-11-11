// Trang 404 (tương ứng views/client/404.ejs).
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="wrap page"><div className="success"><h1>Không tìm thấy trang</h1><p>Địa chỉ bạn truy cập không tồn tại.</p><div><Link className="ghostLink" to="/">Về trang chủ</Link></div></div></main>
  );
}
