Hệ thống quản lý món ăn
Ứng dụng quản lý món ăn sử dụng React, backend API Node.js/Express và cơ sở dữ liệu MongoDB Atlas. Hệ thống hỗ trợ xem danh sách, xem chi tiết, tìm kiếm, thêm, cập nhật và xóa món ăn.
Thông tin sinh viên
- Họ và tên: Châu Hoàng Khanh
- MSSV: 236768
- Repository: 236768_ChauHoangKhanh


Công nghệ
- Frontend: React, Vite.
- Backend: Node.js, Express.
- Cơ sở dữ liệu: MongoDB Atlas, Mongoose.
- Đóng gói: Docker; frontend được phục vụ bằng Nginx.
- Lưu trữ image: Docker Hub.
- Triển khai: Render.
Chức năng
- Hiển thị danh sách và thông tin chi tiết món ăn.
- Tìm kiếm theo tên món ăn, loại món ăn hoặc vùng miền.
- Thêm, cập nhật và xóa món ăn.
- Kiểm tra dữ liệu đầu vào và ngăn trùng mã món ăn foodId.
- Hiển thị trạng thái đang tải, thông báo lỗi và kết quả thao tác.
- Cung cấp endpoint /health để kiểm tra backend.
Cấu trúc dự án
236768_ChauHoangKhanh/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
Các thư mục node_modules/, file chứa cấu hình riêng và kết quả build không cần đưa lên GitHub.
Cơ sở dữ liệu
- Database: 236768_ChauHoangKhanh.
- Collection: foods.
Trường	Kiểu dữ liệu	Ý nghĩa
foodId	Chuỗi	Mã món ăn, không được trùng
name	Chuỗi	Tên món ăn
category	Chuỗi	Loại món ăn
cuisine	Chuỗi	Ẩm thực hoặc vùng miền
ingredients	Mảng chuỗi	Danh sách nguyên liệu
price	Số	Giá bán, đơn vị VNĐ
quantity	Số nguyên	Số lượng hiện có
description	Chuỗi	Mô tả món ăn
imageUrl	Chuỗi	URL hình ảnh, có thể để trống nếu chưa có



Yêu cầu môi trường
- Node.js và npm tương thích với phiên bản Vite trong client/package.json; Dockerfile hiện sử dụng node:20-alpine.
- Git để quản lý mã nguồn.
- Docker Desktop đang hoạt động nếu chạy bằng Docker.
- MongoDB Atlas có database user và Network Access cho phép kết nối từ môi trường chạy backend.
Cài đặt và chạy trên máy cá nhân
1. Lấy mã nguồn
Nếu chưa có dự án trên máy, chạy:
git clone https://github.com/Khanhne1234/236768_ChauHoangKhanh.git
cd 236768_ChauHoangKhanh
Nếu đã có mã nguồn, mở Terminal tại thư mục gốc 236768_ChauHoangKhanh.
2. Cấu hình backend
Tạo file server/.env dựa trên server/.env.example:
PORT=5000
MONGODB_URI=<chuoi-ket-noi-MongoDB-Atlas-den-database-236768_ChauHoangKhanh>
Thay giá trị mẫu bằng chuỗi kết nối thực tế. Chuỗi kết nối cần chọn đúng database 236768_ChauHoangKhanh. Không công khai username/password hoặc đưa file server/.env lên GitHub.
3. Cấu hình frontend dùng backend local
Tạo file client/.env.local:
VITE_API_URL=http://localhost:5000/api/foods
Trong dự án này, VITE_API_URL là URL đầy đủ đến endpoint /api/foods. Khởi động lại Vite sau khi thay đổi cấu hình.
4. Chạy backend
Mở Terminal tại thư mục gốc dự án:
cd server
npm install
npm run dev
- Backend: http://localhost:5000
- Health check: http://localhost:5000/health
5. Chạy frontend
Mở Terminal thứ hai tại thư mục gốc dự án:
cd client
npm install
npm run dev
Mở địa chỉ Vite hiển thị trong Terminal, thường là http://localhost:5173. Giữ cả hai Terminal hoạt động trong lúc sử dụng ứng dụng.
API món ăn
Phương thức	Endpoint	Chức năng
GET	/api/foods	Lấy danh sách món ăn
GET	/api/foods/:id	Xem chi tiết món ăn
POST	/api/foods	Thêm món ăn
PUT	/api/foods/:id	Cập nhật món ăn
DELETE	/api/foods/:id	Xóa món ăn
GET	/api/foods?search=pho	Tìm kiếm món ăn
GET	/health	Kiểm tra trạng thái backend


Khi kiểm thử POST và PUT, gửi dữ liệu JSON với header Content-Type: application/json. Sử dụng _id được API trả về cho tham số :id; foodId là mã nghiệp vụ của món ăn.
Docker images
Thành phần	Image
Backend	hoangkhanhchau17112004/food-management-backend:1.0
Frontend dùng backend Render	hoangkhanhchau17112004/food-management-frontend:1.4


Các lệnh Docker bên dưới được chạy từ thư mục gốc dự án. Nếu cổng đã được sử dụng, dừng ứng dụng đang chiếm cổng hoặc chọn cổng máy chủ khác. Nếu tên container đã tồn tại, chọn tên mới.
Chạy backend từ Docker Hub
Chuẩn bị server/.env như phần cấu hình backend, sau đó chạy:
docker pull hoangkhanhchau17112004/food-management-backend:1.0
docker run -d --name food-backend -p 5000:5000 --env-file server/.env -e PORT=5000 hoangkhanhchau17112004/food-management-backend:1.0
Kiểm tra tại http://localhost:5000/health. Xem log bằng:
docker logs food-backend
Chạy frontend từ Docker Hub
Image 1.4 đã được build để gọi backend Render:
docker pull hoangkhanhchau17112004/food-management-frontend:1.4
docker run -d --name food-frontend -p 3000:80 hoangkhanhchau17112004/food-management-frontend:1.4
Mở http://localhost:3000. Với image này, frontend cần Internet để gọi backend Render và không cần backend local chạy trên máy.
Build frontend để gọi backend local
Dùng tag riêng food-management-frontend:local cho bản chạy local:
docker build --build-arg VITE_API_URL=http://localhost:5000/api/foods -t food-management-frontend:local -f client/Dockerfile client
docker run -d --name food-frontend-local -p 3001:80 food-management-frontend:local
Mở http://localhost:3001 trên cùng máy đang chạy backend tại cổng 5000.
Build và push image backend
docker login -u hoangkhanhchau17112004
docker build --platform linux/amd64 -t hoangkhanhchau17112004/food-management-backend:1.0 -f server/Dockerfile server
docker push hoangkhanhchau17112004/food-management-backend:1.0
File server/.dockerignore cần loại trừ .env, các file chứa bí mật và node_modules/ để không đưa chúng vào image. Truyền MONGODB_URI khi chạy container hoặc cấu hình trên Render.
Build và push image frontend dùng backend Render
Trong build stage của client/Dockerfile, khai báo ARG và ENV trước khi chạy npm run build:
ARG VITE_API_URL=https://food-backend-236768.onrender.com/api/foods
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build
Build và push:
docker build --platform linux/amd64 --build-arg VITE_API_URL=https://food-backend-236768.onrender.com/api/foods -t hoangkhanhchau17112004/food-management-frontend:1.4 -f client/Dockerfile client
docker push hoangkhanhchau17112004/food-management-frontend:1.4
Vite đưa giá trị VITE_API_URL vào JavaScript khi build. Khi thay đổi địa chỉ API, cần build lại image, push lên Docker Hub và triển khai lại frontend. Chỉ thay đổi biến môi trường khi chạy container Nginx không cập nhật được URL đã nằm trong JavaScript.
Triển khai trên Render
Backend
- Loại dịch vụ: Web Service từ Existing Image.
- Image: docker.io/hoangkhanhchau17112004/food-management-backend:1.0.
- Biến môi trường: PORT=10000 và MONGODB_URI là chuỗi kết nối MongoDB Atlas thực tế.
- Health Check Path: /health.
- URL: https://food-backend-236768.onrender.com.
Backend cần lắng nghe cổng từ process.env.PORT, cho phép kết nối mạng của Render trong MongoDB Atlas và cấu hình CORS cho origin https://food-frontend-236768.onrender.com.
Frontend
- Loại dịch vụ: Web Service từ Existing Image.
- Image: docker.io/hoangkhanhchau17112004/food-management-frontend:1.4.
- Nginx trong image lắng nghe cổng 80; có thể cấu hình PORT=80 để Render xác định cổng dịch vụ.
- API được đưa vào image lúc build: https://food-backend-236768.onrender.com/api/foods.
- URL: https://food-frontend-236768.onrender.com.
Sau khi push image mới, kiểm tra Image URL của dịch vụ dùng đúng tag, rồi chọn Manual Deploy → Deploy latest reference. Chờ triển khai thành công trước khi kiểm tra giao diện.
Kiểm tra sau khi triển khai
Thực hiện các bước sau trên URL frontend công khai:
1. Mở /health của backend và kiểm tra phản hồi thành công.
2. Kiểm tra danh sách món ăn được tải từ database.
3. Xem chi tiết một món ăn.
4. Tìm kiếm theo tên, loại món ăn hoặc vùng miền.
5. Thêm một món thử nghiệm với foodId chưa sử dụng.
6. Cập nhật món thử nghiệm và kiểm tra dữ liệu sau khi tải lại trang.
7. Xóa món thử nghiệm, xác nhận món đó không còn trong danh sách.
8. Kiểm tra thông báo khi nhập dữ liệu không hợp lệ hoặc trùng foodId.
Trong DevTools → Network, yêu cầu danh sách món ăn cần gọi https://food-backend-236768.onrender.com/api/foods và nhận phản hồi 200 OK. Nếu còn gọi localhost:5000, kiểm tra cấu hình lúc build và image đang triển khai.
Bảo vệ thông tin cấu hình
- Không commit .env, .env.local, mật khẩu, access token hoặc chuỗi kết nối có thông tin đăng nhập.
- .env.example chỉ chứa tên biến và giá trị mẫu.
- Chỉ cấu hình MongoDB ở backend; frontend gọi API để truy cập dữ liệu.
- Các biến bắt đầu bằng VITE_ được đưa vào mã frontend, vì vậy không dùng chúng để lưu bí mật.
Cập nhật README lên GitHub