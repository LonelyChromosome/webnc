# 🖥️ KaDa Store - Bán Linh Kiện & PC Build Sẵn

Website bán linh kiện máy tính và PC build sẵn, có công cụ **PC Builder** tự kiểm tra tương thích linh kiện và **trợ lý tư vấn** gợi ý bộ PC theo ngân sách.

Dự án gồm có **frontend React** và **backend Express** giao tiếp qua REST API, xác thực bằng **JWT**.

- Trang web (GitHub Pages): https://kany2006.github.io/BanVaMoPhongpc/

---

## ✨ Chức năng hiện có

**Khách hàng**
- Xem, tìm kiếm, lọc theo danh mục và sắp xếp theo giá sản phẩm.
- Xem chi tiết sản phẩm và thông số kỹ thuật.
- **PC Build sẵn** theo 4 phân khúc: Rẻ nhất (~15 triệu), Trung bình (~25 triệu), Cao cấp (~50 triệu), VIP Pro (~100 triệu).
- **PC Builder**: chọn CPU, Mainboard, RAM, GPU, SSD, PSU. Hệ thống lọc linh kiện tương thích và cảnh báo:
  - CPU và Mainboard phải cùng socket.
  - RAM phải đúng chuẩn DDR của Mainboard.
  - Nguồn (PSU) phải đủ công suất cho card đồ họa.
- **Trợ lý tư vấn**: người dùng gõ nhu cầu hoặc ngân sách (ví dụ "PC chơi game khoảng 25 triệu"), hệ thống đề xuất bộ PC phù hợp. Đây là thuật toán dựa trên từ khóa (rule-based), không dùng AI.
- Giỏ hàng (lưu trên trình duyệt), đặt hàng, xem lịch sử đơn hàng.
- Đăng ký, đăng nhập.

**Quản trị (admin)**
- Tổng quan: doanh thu, số đơn, đơn chờ duyệt, sản phẩm sắp hết hàng.
- Quản lý sản phẩm: thêm, sửa, xóa.
- Quản lý đơn hàng: đổi trạng thái (Chờ duyệt, Đang giao, Hoàn tất, Đã hủy). Hủy đơn thì tồn kho được cộng lại.

---

## 🧰 Công nghệ

| Phần | Công nghệ |
|---|---|
| Frontend | React 19, Vite, React Router (HashRouter), CSS thuần |
| Backend | Node.js (CommonJS), Express 5, kiến trúc MVC |
| Cơ sở dữ liệu | SQLite (thư viện `sql.js`, chạy thuần JavaScript, không cần cài thêm) |
| Xác thực | JWT (`jsonwebtoken`), token gửi qua header `Authorization: Bearer ...` |
| Test | `node:test` có sẵn trong Node (47 test) |
| CI/CD | GitHub Actions: chạy test và deploy frontend lên GitHub Pages |

---

## 🏗️ Cấu trúc thư mục

```text
BanVaMoPhongpc/
├── package.json                 chạy cả hai phần bằng một lệnh
├── .github/workflows/
│   ├── test.yml                 tự chạy test khi push
│   └── pages.yml                tự deploy frontend lên GitHub Pages
│
├── backend/                     Express API (MVC)
│   ├── app.js                   điểm vào, gắn routes
│   ├── database/
│   │   ├── schema.sql           cấu trúc bảng
│   │   └── seed.sql             dữ liệu mẫu
│   ├── src/
│   │   ├── config/              DBConnection.js, AuthFilter.js (JWT)
│   │   ├── models/              User, Product, Order, PCBuilder (chứa SQL)
│   │   ├── controllers/         Auth, Home, Product, Cart, PCBuilder, Chat, Admin
│   │   └── routes/              web.js (khách), admin.js (quản trị)
│   └── test/                    47 test
│
└── frontend/                    React (Vite)
    ├── index.html
    ├── public/uploads/          ảnh sản phẩm
    └── src/
        ├── main.jsx, App.jsx    điểm vào và bảng đường dẫn
        ├── pages/               Home, Products, ProductDetail, Cart, PCBuilder,
        │                        Orders, Login, Register, NotFound, admin/*
        ├── components/          Header, Footer, ProductCard, Chatbot, Logo, AdminSidebar
        ├── context/             AuthContext (đăng nhập), CartContext (giỏ hàng)
        ├── services/api.js      mọi lời gọi tới backend, tự gắn token JWT
        └── styles/              style.css, admin.css
```

### Luồng một request (ví dụ đặt hàng)
```text
Cart.jsx → services/api.js (gắn token) → POST /api/checkout
  → routes/web.js → AuthFilter.requireLogin (kiểm tra JWT)
  → CartController.checkout → OrderModel.create → DBConnection → SQLite
```
- **Routes** ghép đường dẫn với controller.
- **Controllers** nhận request, gọi model, trả JSON.
- **Models** chứa toàn bộ câu SQL.
- Giỏ hàng nằm ở trình duyệt; khi đặt hàng, server tự lấy giá và tồn kho từ database nên không tin giá do client gửi.

---

## 🚀 Chạy dự án

Yêu cầu: **Node.js 18 trở lên**.

```bash
git clone https://github.com/KaNy2006/BanVaMoPhongpc.git
cd BanVaMoPhongpc

npm run install:all     # cài thư viện cho backend, frontend và thư mục gốc
npm run dev             # chạy cả backend và frontend
```

| Thành phần | Địa chỉ |
|---|---|
| Frontend (mở địa chỉ này để xem web) | http://localhost:5173 |
| Backend API | http://localhost:4000/api |

> Mở thẳng `http://localhost:4000` sẽ thấy "Cannot GET /". Đây là bình thường vì backend chỉ trả dữ liệu ở các đường dẫn `/api/...`. Thử `http://localhost:4000/api/products`.

Chạy riêng từng phần:
```bash
cd backend  && npm install && npm start
cd frontend && npm install && npm run dev
```


### Tài khoản mẫu
| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin (vào `/#/admin`) | admin@store.test | admin123 |
| Khách hàng | user@store.test | user123 |

> Mật khẩu hiện lưu chữ thường để đơn giản hóa bài học. Không dùng mật khẩu thật.

---

## 🧪 Chạy test

```bash
npm test
```
Kết quả đúng: `# pass 47`, `# fail 0`. Test dùng database trong bộ nhớ nên không ảnh hưởng dữ liệu thật.

---

## 🔌 API chính

| Phương thức | Đường dẫn | Quyền |
|---|---|---|
| POST | `/api/login`, `/api/register` | công khai |
| GET | `/api/me` | đăng nhập |
| GET | `/api/home`, `/api/products`, `/api/products/:id` | công khai |
| GET | `/api/pc-builder?cpuId=..&mainboardId=..` | công khai |
| POST | `/api/chat` | công khai |
| POST | `/api/checkout` | đăng nhập |
| GET | `/api/orders/mine` | đăng nhập |
| GET | `/api/admin` (tổng quan) | admin |
| GET, POST | `/api/admin/products` | admin |
| PUT, DELETE | `/api/admin/products/:id` | admin |
| GET | `/api/admin/orders` | admin |
| PUT | `/api/admin/orders/:id/status` | admin |

## 🗃️ Cơ sở dữ liệu

| Bảng | Nội dung |
|---|---|
| `users` | tài khoản (role: `admin` hoặc `customer`) |
| `products` | linh kiện và PC build sẵn; cột `specs` là chuỗi JSON chứa thông số (socket, loại RAM, công suất...) |
| `orders` | đơn hàng (trạng thái, tổng tiền, địa chỉ nhận) |
| `order_items` | chi tiết từng đơn |

Ảnh sản phẩm nằm ở `frontend/public/uploads/`, mỗi loại linh kiện dùng chung một ảnh. Cột `image` trong `products` lưu đường dẫn, ví dụ `/uploads/cpu.jpg`.

---

## 🌐 Triển khai

Frontend đăng lên **GitHub Pages**, backend cần đặt ở nơi chạy được Node.js (ví dụ Render).

1. Triển khai thư mục `backend/` lên Render (Build: `npm install`, Start: `npm start`), đặt biến `JWT_SECRET`.
2. Trên GitHub: Settings → Pages → Source chọn **GitHub Actions**.
3. Settings → Secrets and variables → Actions → **Variables** → tạo biến `API_URL` có giá trị là địa chỉ backend.
4. Push lên `main`, workflow `pages.yml` tự build và đăng frontend.

---

## 👥 Phân công và quy ước làm việc

| Thành viên | Phụ trách | Nhánh |
|---|---|---|
| Đạo | CSS, Frontend, API (phía gọi), Login (giao diện) | `frontend` |
| Khánh | Backend, Database, Test, MVC, JWT (phía server) | `backend` |

## 🔭 Hướng phát triển

Các ý tưởng từ giai đoạn thiết kế ban đầu, **chưa được làm** trong phiên bản hiện tại:

- Phân tích bottleneck CPU/GPU/RAM/PSU và gợi ý nâng cấp theo ngân sách.
- Lưu cấu hình PC của người dùng, ước tính FPS và điện năng.
- Băm mật khẩu bằng bcrypt, phân trang sản phẩm, thanh toán trực tuyến.
- Chuyển sang MySQL nếu cần chạy nhiều người dùng cùng lúc.

## ⚠️ Lưu ý
- Trợ lý tư vấn và kiểm tra tương thích dựa trên luật đơn giản, chỉ mang tính tham khảo.
- Dữ liệu sản phẩm là dữ liệu mẫu phục vụ học tập.
