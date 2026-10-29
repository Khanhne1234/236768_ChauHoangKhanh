# Hệ thống quản lý món ăn

Ứng dụng quản lý món ăn gồm giao diện React, backend API Node.js/Express và cơ sở dữ liệu MongoDB Atlas. Ứng dụng hỗ trợ xem, tìm kiếm, thêm, cập nhật và xóa món ăn.

## Công nghệ

- React, Vite
- Node.js, Express
- MongoDB Atlas, Mongoose
- Docker, Docker Hub
- Render

## Cấu trúc dự án

```text
.
├── client/                 # Frontend React
└── server/                 # Backend API Express
    ├── models/
    ├── routes/
    ├── .env.example
    └── server.js
```

## Yêu cầu

- Node.js 20 trở lên
- npm
- Docker Desktop (để chạy bằng Docker)
- Tài khoản MongoDB Atlas

## Cài đặt và chạy ở máy cá nhân

### 1. Cấu hình backend

Tạo file `server/.env` dựa trên `server/.env.example`, sau đó điền thông tin kết nối MongoDB Atlas:

```env
PORT=5000
MONGODB_URI=<chuỗi-kết-nối-MongoDB-Atlas>
```

Không đưa file `server/.env` hoặc thông tin đăng nhập MongoDB lên GitHub.

### 2. Cài thư viện

Mở Terminal tại thư mục dự án:

```bash
cd server
npm install
cd ../client
npm install
```

### 3. Chạy backend

Mở một Terminal:

```bash
cd server
npm run dev
```

Backend mặc định chạy tại `http://localhost:5000`.

### 4. Chạy frontend

Mở Terminal thứ hai:

```bash
cd client
npm run dev
```

Mở địa chỉ Vite hiển thị trong Terminal, thường là `http://localhost:5173`.

Frontend mặc định gọi backend tại `http://localhost:5000/api/foods`. Có thể cấu hình địa chỉ API bằng biến `VITE_API_URL`.

## API món ăn

| Phương thức | Endpoint | Chức năng |
|---|---|---|
| GET | `/api/foods` | Lấy danh sách món ăn |
| GET | `/api/foods/:id` | Xem chi tiết món ăn |
| POST | `/api/foods` | Thêm món ăn |
| PUT | `/api/foods/:id` | Cập nhật món ăn |
| DELETE | `/api/foods/:id` | Xóa món ăn |
| GET | `/api/foods?search=pho` | Tìm theo tên, loại món hoặc vùng miền |
| GET | `/health` | Kiểm tra trạng thái backend |

## Chạy backend bằng Docker

Image backend trên Docker Hub:

```text
hoangkhanhchau17112004/food-management-backend:1.0
```

Build image từ thư mục gốc dự án:

```bash
docker build -t hoangkhanhchau17112004/food-management-backend:1.0 -f server/Dockerfile server
```

Chạy container, truyền cấu hình MongoDB lúc chạy:

```bash
docker run -d --name food-backend -p 5000:5000 --env-file server/.env hoangkhanhchau17112004/food-management-backend:1.0
```

Kiểm tra backend tại `http://localhost:5000/health`.

## Chạy frontend bằng Docker

Image frontend trên Docker Hub:

```text
hoangkhanhchau17112004/food-management-frontend:1.0
```

Build image. Khi chạy ở máy cá nhân, API trỏ đến backend ở cổng `5000`:

```bash
docker build --build-arg VITE_API_URL=http://localhost:5000/api/foods -t hoangkhanhchau17112004/food-management-frontend:1.0 -f client/Dockerfile client
```

Chạy container:

```bash
docker run -d --name food-frontend -p 3000:80 hoangkhanhchau17112004/food-management-frontend:1.0
```

Mở `http://localhost:3000` để sử dụng giao diện. Backend cần đang chạy tại `http://localhost:5000`.

## Docker Hub

- Backend: `hoangkhanhchau17112004/food-management-backend:1.0`
- Frontend: `hoangkhanhchau17112004/food-management-frontend:1.0`

## Triển khai trên Render

Khi triển khai frontend, cấu hình `VITE_API_URL` thành URL backend API trên Render, có dạng:

https://food-frontend-236768.onrender.com
```

Cập nhật URL triển khai thực tế sau khi tạo các dịch vụ Render.