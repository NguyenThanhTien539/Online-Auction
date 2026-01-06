# Hướng Dẫn Thiết Lập Dự Án Đấu Giá Trực Tuyến

Dự án này bao gồm ba phần chính: Cơ sở dữ liệu (PostgreSQL), Backend (Node.js/TypeScript), và Frontend (React/Vite). Hướng dẫn dưới đây sẽ giúp bạn thiết lập và triển khai toàn bộ dự án trên máy local.

## Yêu Cầu Hệ Thống

- Node.js (phiên bản 16 trở lên)
- PostgreSQL (phiên bản 12 trở lên)
- npm hoặc yarn

## 1. Thiết Lập Cơ Sở Dữ Liệu (Database)

### 1.1 Cài Đặt PostgreSQL

1. Tải và cài đặt PostgreSQL từ [trang chính thức](https://www.postgresql.org/download/).
2. Trong quá trình cài đặt, ghi nhớ username và password của PostgreSQL (mặc định thường là `postgres`).

### 1.2 Tạo Cơ Sở Dữ Liệu

1. Mở pgAdmin hoặc command line của PostgreSQL.
2. Tạo một database mới với tên `auction_db` (hoặc tên tùy ý).

### 1.3 Chạy Scripts Khởi Tạo Dữ Liệu

1. Mở terminal và điều hướng đến thư mục `Backend/data`.
2. Chạy các file SQL theo thứ tự:
   - Chạy `category/category.insert.sql` để thêm dữ liệu categories.
   - Chạy `product/product.insert.sql` để thêm dữ liệu products.
   - Chạy `migrations/add_auction_end_email_sent.sql` nếu cần thiết.
   - Chạy `sql/function.sql` để tạo các functions cần thiết.

Bạn có thể sử dụng pgAdmin để import các file SQL này vào database vừa tạo.

### 1.4 (Tùy Chọn) Chạy Scripts Python Để Xử Lý Dữ Liệu

Nếu bạn muốn xử lý dữ liệu bổ sung:

1. Cài đặt Python (phiên bản 3.8 trở lên).
2. Trong thư mục `Backend/data`, chạy:
   ```
   pip install -r requirements.txt
   ```
3. Chạy các notebook Jupyter (.ipynb) trong các thư mục con để xử lý dữ liệu nếu cần.

## 2. Thiết Lập Backend

### 2.1 Cài Đặt Dependencies

1. Mở terminal và điều hướng đến thư mục `Backend`.
2. Chạy lệnh:
   ```
   npm install
   ```

### 2.2 Cấu Hình Biến Môi Trường

1. Tạo file `.env` trong thư mục `Backend` với nội dung sau (thay đổi theo thông tin PostgreSQL của bạn):

   ```
   DB_CLIENT=pg
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=auction_db
   DB_USER=postgres
   DB_PASSWORD=your_password_here

   # Các biến khác nếu cần (JWT secret, email config, v.v.)
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 2.3 Chạy Backend

1. Trong thư mục `Backend`, chạy:
   ```
   npm run dev
   ```
2. Backend sẽ chạy trên `http://localhost:5000`.

## 3. Thiết Lập Frontend

### 3.1 Cài Đặt Dependencies

1. Mở terminal và điều hướng đến thư mục `Frontend`.
2. Chạy lệnh:
   ```
   npm install
   ```

### 3.2 Chạy Frontend

1. Trong thư mục `Frontend`, chạy:
   ```
   npm run dev
   ```
2. Frontend sẽ chạy trên `http://localhost:5173`.

## 4. Triển Khai Toàn Bộ Dự Án

### 4.1 Chạy Song Song Backend và Frontend

1. Mở hai terminal riêng biệt.
2. Trong terminal 1: Chạy backend (`npm run dev` trong thư mục Backend).
3. Trong terminal 2: Chạy frontend (`npm run dev` trong thư mục Frontend).

### 4.2 Truy Cập Ứng Dụng

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### 4.3 Build Cho Production (Tùy Chọn)

Để build frontend cho production:

1. Trong thư mục `Frontend`, chạy:
   ```
   npm run build
   ```
2. File build sẽ được tạo trong thư mục `dist`.

Để build backend:

1. Trong thư mục `Backend`, chạy:
   ```
   npm run build
   ```
2. File build sẽ được tạo trong thư mục `dist`.

## 5. Cấu Hình Bổ Sung

### 5.1 Email Setup

Để gửi email (cho việc kết thúc đấu giá), cấu hình trong file `.env`:

- `EMAIL_USER`: Email gửi
- `EMAIL_PASS`: Mật khẩu ứng dụng (app password)

### 5.2 Cloudinary Setup

Để upload hình ảnh:

- Đăng ký tài khoản Cloudinary
- Thêm thông tin vào `.env`

### 5.3 Socket.io

Ứng dụng sử dụng Socket.io cho đấu giá real-time. Đảm bảo CORS được cấu hình đúng (mặc định cho `localhost:5173`).

## 6. Troubleshooting

- Nếu gặp lỗi kết nối database, kiểm tra lại thông tin trong `.env`.
- Nếu port bị conflict, thay đổi port trong `server.ts` (backend) hoặc `vite.config.ts` (frontend).
- Đảm bảo PostgreSQL đang chạy trước khi start backend.

## 7. Cấu Trúc Dự Án

- `Backend/`: Code backend với Express.js, Socket.io, Knex.js
- `Frontend/`: Code frontend với React, Vite, TailwindCSS
- `uploads/`: Thư mục chứa file upload

Chúc bạn thành công trong việc thiết lập dự án!
