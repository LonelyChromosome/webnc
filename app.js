const express = require("express");
const path = require("path");
const session = require("express-session");

const postRoutes = require("./routes/postRoute");
const authRoutes = require("./routes/authRoute");
const { usesession } = require("./middlewares/authMiddleware");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: process.env.SESSION_SECRET || "mysecretkey",
  resave: false,
  saveUninitialized: false
}));

app.use(usesession);

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", authRoutes);
app.use("/news", postRoutes);

app.use((req, res) => {
  res.status(404).send("404 - Không tìm thấy trang");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
