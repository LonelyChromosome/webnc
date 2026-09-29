# WEBNC - Lab 10 Express MVC

Branch `lab10-mvc` refactor project sang Express theo mô hình MVC đúng yêu cầu Lab 10.

## Cấu trúc
- `routes/`: định nghĩa URL
- `controllers/`: xử lý request/response
- `models/`: truy vấn MySQL
- `middlewares/`: kiểm tra đăng nhập và đưa session vào view
- `views/`: EJS chia theo `posts/`, `auth/`, `partials/`
- `public/`: CSS
- `app.js`: khởi tạo Express, session và mount route

## Database
Chạy `database.sql` trong MySQL.

Mặc định:
- host: `localhost`
- user: `root`
- password: `123456`
- database: `newsdb`

Tài khoản demo:
```text
username: admin
password: 123456
```

## Chạy
```bash
npm install
npm start
```

Các URL cần kiểm tra:
- `/`
- `/news`
- `/news/search?keyword=node`
- `/news/1`
- `/login`
- `/logout`
- `/news/add`
- `/news/1/edit`

Thêm, sửa và xóa bài viết yêu cầu đăng nhập.
