const http = require("http");
const fs = require("fs");
const path = require("path");

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

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/intro") {
    sendFile(res, "intro.html");
    return;
  }

  if (req.url === "/contact") {
    sendFile(res, "contact.html");
    return;
  }

  if (req.url === "/news") {
    readDatabase((err, posts) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Khong the doc database");
        return;
      }

      const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>News</title>
</head>
<body>
  <h1>Danh sach bai viet</h1>
  ${posts.map(post => `
    <article>
      <h2>${post.title}</h2>
      <p>${post.content}</p>
    </article>
    <hr>
  `).join("")}
</body>
</html>`;

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
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
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
