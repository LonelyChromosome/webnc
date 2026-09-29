# WEBNC - Lab 11 Express REST API

Branch `lab11-rest-api` được tạo từ `lab10-mvc`.

Lab 11 giữ nguyên toàn bộ phần EJS/MVC của Lab 10 và bổ sung REST API dùng chung các model hiện có.

## API posts

- `GET /api/posts` - danh sách bài viết
- `GET /api/posts/search?keyword=node` - tìm kiếm
- `GET /api/posts/:id` - chi tiết
- `POST /api/posts` - thêm bài viết
- `PUT /api/posts/:id` - cập nhật
- `DELETE /api/posts/:id` - xóa

Ba API thêm/sửa/xóa yêu cầu đăng nhập session.

## API auth

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Ví dụ đăng nhập:

```json
{
  "username": "admin",
  "password": "123456"
}
```

## Test Postman

### Thêm bài viết

`POST http://localhost:3000/api/posts`

```json
{
  "title": "Bài viết từ API",
  "description": "Bài viết này được thêm bằng REST API"
}
```

### Cập nhật

`PUT http://localhost:3000/api/posts/1`

```json
{
  "title": "Tiêu đề đã cập nhật",
  "description": "Mô tả đã cập nhật bằng REST API"
}
```

## Chạy

```bash
npm install
npm start
```
