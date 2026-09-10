const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

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
    sendFile(res, "news.ejs");
    return;
  }

  if (req.url === "/demo.js") {
    sendFile(res, "demo.js", "application/javascript; charset=utf-8");
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404 - Khong tim thay trang");
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
