// Trợ lý tư vấn "giả AI": không gọi AI thật, chỉ đọc từ khóa trong câu chat rồi chọn PC build sẵn phù hợp.
//   1) Có ghi ngân sách ("25 triệu", "50tr")  -> chọn bộ đắt nhất không vượt ngân sách
//   2) Có tên phân khúc ("rẻ", "cao cấp", "vip")-> chọn đúng phân khúc
//   3) Có nhu cầu ("game", "đồ họa", "văn phòng") -> chọn phân khúc hợp nhu cầu
const ProductModel = require("../models/ProductModel");

const money = (n) => n.toLocaleString("vi-VN") + "₫";

function pickTier(text) {
  if (/vip|pro|khủng|mạnh nhất|dựng phim|ai\b/.test(text)) return "VIP Pro";
  if (/cao cấp|đồ họa|render|stream/.test(text)) return "Cao cấp";
  if (/trung bình|game|chơi/.test(text)) return "Trung bình";
  if (/rẻ|tiết kiệm|sinh viên|văn phòng|học/.test(text)) return "Rẻ nhất";
  return null;
}

async function advise(req, res) {
  const text = String(req.body.message || "").toLowerCase();
  const builds = (await ProductModel.getAll({ category: "PC Build sẵn" })).sort((a, b) => a.price - b.price);
  if (!builds.length) return res.json({ reply: "Hiện shop chưa có PC build sẵn." });

  const m = text.match(/(\d+(?:[.,]\d+)?)\s*(tr|triệu|m\b)/);
  const budget = m ? parseFloat(m[1].replace(",", ".")) * 1e6 : 0;
  const tier = pickTier(text);

  if (!budget && !tier) {
    return res.json({ reply: 'Bạn cho mình biết ngân sách hoặc nhu cầu nhé, ví dụ: "PC chơi game khoảng 25 triệu" hoặc "cần PC cao cấp".' });
  }

  let product;
  let reply;
  if (budget) {
    product = [...builds].reverse().find((b) => b.price <= budget * 1.05);
    if (product) reply = `Với ngân sách khoảng ${money(budget)}, mình đề xuất bộ này (${product.specs.use}).`;
    else { product = builds[0]; reply = `Ngân sách ${money(budget)} hơi thấp, bộ rẻ nhất của shop là ${money(product.price)}.`; }
  } else {
    product = builds.find((b) => b.specs.tier === tier) || builds[0];
    reply = `Mình đề xuất phân khúc ${product.specs.tier}: ${product.specs.use}.`;
  }
  res.json({ reply, product });
}

module.exports = { advise };
