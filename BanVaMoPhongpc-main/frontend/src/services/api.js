// Mọi lời gọi tới backend đi qua file này. Token JWT được lấy từ localStorage và gắn vào header Authorization.
// Khi chạy local, Vite chuyển /api sang backend (xem vite.config.js). Khi đưa lên GitHub Pages, đặt VITE_API_URL.
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "") + "/api";
const TOKEN_KEY = "kada_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => (token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY));

async function request(path, method = "GET", body) {
  const token = getToken();
  let res;
  try {
    res = await fetch(API_BASE + path, {
      method,
      headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Không kết nối được backend. Hãy chạy backend trước (cd backend && npm start).");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Proxy trả lỗi rỗng khi backend chưa chạy
    if (!data.message && res.status >= 500) throw new Error("Không kết nối được backend (cổng 4000). Hãy chạy backend trước.");
    throw new Error(data.message || "Có lỗi xảy ra.");
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, "POST", body),
  put: (path, body) => request(path, "PUT", body),
  del: (path) => request(path, "DELETE"),
};

// ---- Hàm tiện ích dùng chung ----
export const money = (n) => Number(n).toLocaleString("vi-VN") + "₫";

// Ảnh trong DB có dạng "/uploads/cpu.jpg" (file nằm ở public/uploads). Ghép với BASE_URL để chạy được cả trên GitHub Pages.
export const imgUrl = (p) => (!p ? "" : /^https?:/.test(p) ? p : import.meta.env.BASE_URL + p.replace(/^\//, ""));

export const specLabels = {
  socket: "Socket", cores: "Nhân / luồng", tdp: "TDP", ram: "RAM hỗ trợ", vram: "VRAM", psu: "Nguồn đề nghị",
  slot: "Khe cắm", length: "Chiều dài", form: "Kích thước", chipset: "Chipset", type: "Chuẩn", bus: "Bus",
  capacity: "Dung lượng", kit: "Bộ", speed: "Tốc độ đọc", pcie: "PCIe", power: "Công suất", rating: "Chứng nhận",
  modular: "Dây nguồn", tier: "Phân khúc", cpu: "CPU", gpu: "Card đồ họa", ssd: "Ổ cứng", use: "Phù hợp",
};
