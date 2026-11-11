// Điểm vào của backend 
// Luồng: request -> app.js -> routes/web.js | routes/admin.js -> controller -> model -> SQLite
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Đọc file .env 
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = valueParts.join("=").trim();
  });
}

const db = require("./src/config/DBConnection");
const webRoutes = require("./src/routes/web");
const adminRoutes = require("./src/routes/admin");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());           // cho phép frontend (cổng khác) gọi API
app.use(express.json());   // đọc body dạng JSON

app.use("/api", webRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api", (req, res) => res.status(404).json({ message: "Không tìm thấy API." }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Lỗi máy chủ hoặc cơ sở dữ liệu." });
});

// Chỉ mở cổng khi chạy trực tiếp (node app.js). Khi test gọi require("../app") thì không tự mở cổng.
if (require.main === module) {
  db.ready.then(() => {
    app.listen(PORT, () => console.log(`KaDa Store API đang chạy tại http://localhost:${PORT}`));
  });
}

module.exports = app;
