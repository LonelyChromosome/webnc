// Bảng đường dẫn của website (giống routes/web.js + routes/admin.js bên backend).
// Trang khách bọc trong <ClientLayout> (Header + Footer + Chatbot), trang admin bọc trong <AdminLayout>.
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Chatbot from "./components/Chatbot.jsx";
import { useCart } from "./context/CartContext.jsx";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import PCBuilder from "./pages/PCBuilder.jsx";
import Cart from "./pages/Cart.jsx";
import Orders from "./pages/Orders.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import ManageProducts from "./pages/admin/ManageProducts.jsx";
import ManageOrders from "./pages/admin/ManageOrders.jsx";

function ClientLayout() {
  const { notice } = useCart();
  return (
    <>
      <Header />
      <Outlet /> {/* nơi hiển thị trang con */}
      <Footer />
      <Chatbot />
      {notice && <div className="toast">{notice}</div>}
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/pc-builder" element={<PCBuilder />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="orders" element={<ManageOrders />} />
      </Route>
    </Routes>
  );
}
