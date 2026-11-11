// Giỏ hàng lưu ở localStorage (backend dùng JWT nên không có session như file gốc).
// items = [{ id, name, image, price, stock, quantity }]
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("kada_cart") || "[]"));
  const [notice, setNotice] = useState(""); // thông báo nhỏ "Đã thêm vào giỏ"

  useEffect(() => { localStorage.setItem("kada_cart", JSON.stringify(items)); }, [items]);

  function addToCart(product, quantity = 1) {
    if (product.stock <= 0) return;
    setItems((cur) => {
      const found = cur.find((i) => i.id === product.id);
      if (found) return cur.map((i) => (i.id === product.id ? { ...i, quantity: Math.min(product.stock, i.quantity + quantity) } : i));
      return [...cur, { id: product.id, name: product.name, image: product.image, price: product.price, stock: product.stock, quantity }];
    });
    setNotice("Đã thêm vào giỏ hàng");
    setTimeout(() => setNotice(""), 2000);
  }

  const setQuantity = (id, q) => setItems((cur) => cur.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(i.stock, q)) } : i)));
  const removeItem = (id) => setItems((cur) => cur.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, notice, addToCart, setQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
