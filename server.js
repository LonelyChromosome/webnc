const http = require("http");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const querystring = require("querystring");
const db = require("./config/db");

const PORT = 3000;
const DB_FILE = path.join(__dirname, "db.json");

function sendFile(res, fileName, contentType = "text/html; charset=utf-8") {
  const filePath = path.join(__dirname, fileName);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 - Khong tim thay tep");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

function readDatabase(callback) {
  fs.readFile(DB_FILE, "utf8", (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    try {
      callback(null, JSON.parse(data));
    } catch (parseError) {
      callback(parseError);
    }
  });
}

function renderView(res, viewName, data = {}) {
  const filePath = path.join(__dirname, "views", viewName);

  fs.readFile(filePath, "utf8", (err, template) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>Lỗi server</h1>");
      return;
    }

    const html = ejs.render(template, data);
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });
}

function getPostBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(querystring.parse(body));
    });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/delete") && req.method === "GET") {
      const myURL = new URL(req.url, `http://localhost:${PORT}`);
      const id = myURL.searchParams.get("id");

      await db.query("DELETE FROM posts WHERE id = ?", [id]);
      res.writeHead(302, { Location: "/news" });
      res.end();
      return;
    }

    if (req.url === "/create" && req.method === "POST") {
      const formData = await getPostBody(req);
      await db.query(
        "INSERT INTO posts(title, description) VALUES (?, ?)",
        [formData.title, formData.description]
      );

      res.writeHead(302, { Location: "/news" });
      res.end();
      return;
    }

    if (req.url === "/edit" && req.method === "POST") {
      const formData = await getPostBody(req);
      await db.query(
        "UPDATE posts SET title = ?, description = ? WHERE id = ?",
        [formData.title, formData.description, formData.id]
      );

      res.writeHead(302, { Location: "/news/" + formData.id });
      res.end();
      return;
    }

    if (req.url === "/" || req.url === "/intro") {
      sendFile(res, "intro.html");
      return;
    }

    if (req.url === "/contact" || req.url === "/about") {
      sendFile(res, "contact.html");
      return;
    }

    if (req.url.startsWith("/news") && req.method === "GET") {
      const pathParts = req.url.split("/");
      const id = pathParts[2];

      if (id) {
        const [newsList] = await db.query(
          "SELECT * FROM posts WHERE id = ?",
          [id]
        );
        renderView(res, "news.ejs", { id, newsList });
      } else {
        const [newsList] = await db.query(
          "SELECT * FROM posts ORDER BY id DESC LIMIT 10"
        );
        renderView(res, "news.ejs", { id: "", newsList });
      }
      return;
    }

    if (req.url.startsWith("/search") && req.method === "GET") {
      const myURL = new URL(req.url, `http://localhost:${PORT}`);
      const keyword = myURL.searchParams.get("keyword") || "";
      let newsList = [];

      if (keyword) {
        [newsList] = await db.query(
          "SELECT * FROM posts WHERE title LIKE ? OR description LIKE ?",
          [`%${keyword}%`, `%${keyword}%`]
        );
      }

      renderView(res, "search.ejs", { keyword, newsList });
      return;
    }

    if (req.url === "/create" && req.method === "GET") {
      renderView(res, "create.ejs");
      return;
    }

    if (req.url.startsWith("/edit") && req.method === "GET") {
      const myURL = new URL(req.url, `http://localhost:${PORT}`);
      const id = myURL.searchParams.get("id");
      const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
      const post = rows.length > 0 ? rows[0] : null;

      renderView(res, "edit.ejs", { post });
      return;
    }

    if (req.url === "/api/news") {
      readDatabase((err, posts) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: "Khong the doc database" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(posts, null, 2));
      });
      return;
    }

    if (req.url === "/demo.js") {
      sendFile(res, "demo.js", "application/javascript; charset=utf-8");
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 - Khong tim thay trang");
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Lỗi kết nối hoặc truy vấn database</h1>");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
