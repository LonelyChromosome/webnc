// Trợ lý tư vấn: người dùng gõ câu hỏi -> POST /api/chat -> backend (ChatController) trả lời + đề xuất 1 bộ PC.
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, money, imgUrl } from "../services/api.js";

export default function Chatbot() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Bạn cần PC cho nhu cầu gì và ngân sách khoảng bao nhiêu? (VD: PC chơi game 25 triệu)" },
  ]);
  const bottom = useRef(null);
  useEffect(() => { bottom.current?.scrollIntoView({ block: "end" }); }, [messages, open]);

  async function send(e) {
    e.preventDefault();
    const message = text.trim();
    if (!message || busy) return;
    setMessages((m) => [...m, { from: "me", text: message }]);
    setText("");
    setBusy(true);
    try {
      const data = await api.post("/chat", { message });
      setMessages((m) => [...m, { from: "bot", text: data.reply, product: data.product }]);
    } catch (err) {
      setMessages((m) => [...m, { from: "bot", text: err.message }]);
    }
    setBusy(false);
  }

  if (!open) return <button className="chatFab" onClick={() => setOpen(true)}><span>KD</span><b>Trợ lý tư vấn</b></button>;

  return (
    <div className="chat">
      <header><div><b>Trợ lý tư vấn KaDa</b><small>Phản hồi tức thì</small></div><button onClick={() => setOpen(false)} aria-label="Đóng">×</button></header>
      <div className="messages">
        {messages.map((m, i) => (
          <div className="msgRow" key={i}>
            <p className={m.from}>{m.text}</p>
            {m.product && (
              <div className="recommend" onClick={() => { navigate(`/products/${m.product.id}`); setOpen(false); }}>
                <img src={imgUrl(m.product.image)} alt="" />
                <span>
                  <small>ĐỀ XUẤT PHÙ HỢP</small>
                  <b>{m.product.name}</b>
                  <p>{m.product.specs.cpu} • {m.product.specs.gpu}</p>
                  <strong>{money(m.product.price)}</strong>
                </span>
              </div>
            )}
          </div>
        ))}
        {busy && <p className="bot">Đang soạn tin...</p>}
        <div ref={bottom} />
      </div>
      <form className="chatInput" onSubmit={send}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="VD: PC chơi game 25 triệu" />
        <button disabled={!text.trim() || busy}>Gửi</button>
      </form>
      <footer>Tư vấn tự động, mang tính tham khảo</footer>
    </div>
  );
}
