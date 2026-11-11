// Điểm vào của frontend: gắn <App /> vào thẻ #root trong index.html.
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import "./styles/style.css";
import "./styles/admin.css";

// HashRouter: địa chỉ dạng /#/products, chạy được trên GitHub Pages mà không cần cấu hình server.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
