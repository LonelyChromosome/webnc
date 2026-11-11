// Kết nối CSDL.
//  - Câu SELECT  -> trả về [mảng các dòng]
//  - Câu INSERT/UPDATE/DELETE -> trả về [{ insertId, affectedRows }]
const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "..");
const dataDir = path.join(root, "data");
// DB_FILE=":memory:" dùng khi chạy test: database nằm trong RAM, không đọc/ghi file nên không ảnh hưởng dữ liệu thật.
const inMemory = process.env.DB_FILE === ":memory:";
const dbFile = inMemory ? null : path.join(dataDir, "kada.db");

let raw = null; // đối tượng database của sql.js
let inTransaction = false;
let timer = null;

// Chạy 1 lần khi khởi động: mở file DB, tạo bảng (schema.sql), thêm dữ liệu mẫu (seed.sql) nếu chưa có.
const ready = (async () => {
  const SQL = await initSqlJs();
  if (!inMemory) fs.mkdirSync(dataDir, { recursive: true });
  raw = !inMemory && fs.existsSync(dbFile) ? new SQL.Database(fs.readFileSync(dbFile)) : new SQL.Database();
  raw.exec("PRAGMA foreign_keys = ON;");
  raw.exec(fs.readFileSync(path.join(root, "database", "schema.sql"), "utf8"));
  const count = raw.exec("SELECT COUNT(*) FROM users")[0].values[0][0];
  if (count === 0) raw.exec(fs.readFileSync(path.join(root, "database", "seed.sql"), "utf8"));
  saveSoon();
})();

// Ghi DB ra file (gom nhiều thay đổi liên tiếp thành 1 lần ghi)
function saveSoon() {
  if (inTransaction || inMemory) return;
  clearTimeout(timer);
  timer = setTimeout(saveNow, 80);
}
function saveNow() {
  const data = Buffer.from(raw.export());
  raw.exec("PRAGMA foreign_keys = ON;"); // export() làm mất cài đặt này nên bật lại
  fs.writeFileSync(dbFile, data);
}
process.on("exit", () => { if (timer && raw && !inMemory) saveNow(); });
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function execute(sql, params = []) {
  await ready;
  const values = params.map((p) => (p === undefined ? null : p));
  if (/^\s*select/i.test(sql)) {
    const stmt = raw.prepare(sql);
    try {
      stmt.bind(values);
      const rows = [];
      while (stmt.step()) rows.push(stmt.getAsObject());
      return [rows];
    } finally {
      stmt.free();
    }
  }
  raw.run(sql, values);
  const affectedRows = raw.getRowsModified();
  const insertId = raw.exec("SELECT last_insert_rowid()")[0].values[0][0];
  saveSoon();
  return [{ insertId, affectedRows }];
}

async function getConnection() {
  return {
    execute,
    beginTransaction: async () => { await ready; raw.run("BEGIN"); inTransaction = true; },
    commit: async () => { raw.run("COMMIT"); inTransaction = false; saveSoon(); },
    rollback: async () => { raw.run("ROLLBACK"); inTransaction = false; },
    release: () => {},
  };
}

module.exports = { execute, getConnection, ready };
