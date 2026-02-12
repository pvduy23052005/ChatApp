# Real-time Chat Application

Ứng dụng nhắn tin thời gian thực hiện đại được xây dựng trên nền tảng MERN Stack (MongoDB, Express, React, Node.js). Dự án sử dụng kiến trúc Client-Server tách biệt, tối ưu hóa trải nghiệm người dùng với Single Page Application (SPA) và hỗ trợ triển khai container hóa độc lập cho từng services.

![React](https://img.shields.io/badge/React-v18-blue)
![Vite](https://img.shields.io/badge/Vite-Fast-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED)

## Tính năng chính

### Giao tiếp thời gian thực
* **Nhắn tin tức thì:** Tốc độ gửi và nhận tin nhắn nhanh chóng thông qua giao thức WebSocket (Socket.IO).
* **Trạng thái hoạt động:** Hiển thị trạng thái Online/Offline của người dùng.
* **Typing Indicator:** Hiển thị trạng thái "đang soạn tin nhắn..." khi đối phương đang gõ.
* **Thông báo:** Nhận thông báo thời gian thực khi có tin nhắn mới hoặc sự kiện nhóm.

### Quản lý Phòng Chat và Nhóm
* **Chat cá nhân (1-1):** Trò chuyện riêng tư, bảo mật.
* **Chat Nhóm:**
    * Tạo nhóm chat mới với tên và ảnh đại diện tùy chỉnh.
    * Phân quyền Trưởng nhóm (Admin) và Thành viên.
    * Trưởng nhóm có quyền đổi tên, cập nhật thông tin và quản lý thành viên (thêm/xóa).
    * Thành viên có quyền tự rời nhóm.

### Tiện ích mở rộng
* **Chia sẻ tập tin:** Hỗ trợ tải lên và xem trước hình ảnh (tích hợp Cloudinary).
* **Xác thực:** Đăng ký, đăng nhập bảo mật bằng JWT (JSON Web Token).

## Công nghệ sử dụng

### Frontend (Client)
* **Core:** React.js, Vite
* **Language:** TypeScript
* **State Management:** Context API .
* **Styling:** CSS Modules
* **Networking:** Axios

### Backend (Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Real-time Engine:** Socket.IO
* **Storage:** Cloudinary

### DevOps
* **Docker & Docker Compose:** Đóng gói ứng dụng riêng biệt cho từng môi trường.

## Hướng dẫn cài đặt và chạy

Do cấu trúc dự án tách biệt, bạn cần khởi chạy Backend và Frontend thông qua các file Docker Compose riêng lẻ nằm trong từng thư mục.

### Phương pháp 1: Sử dụng Docker 

**Bước 1: Khởi chạy Backend**

1.  Di chuyển vào thư mục backend:
    ```bash
    cd backend
    ```
2.  Tạo file `.env` (tham khảo mục Biến môi trường bên dưới) hoặc cấu hình trực tiếp trong `docker-compose.yml`.
3.  Chạy container backend:
    ```bash
    docker-compose up -d --build
    ```

**Bước 2: Khởi chạy Frontend**

1.  Mở một terminal mới và di chuyển vào thư mục frontend:
    ```bash
    cd frontend
    ```
2.  Cấu hình biến môi trường `VITE_API_URL` trong file `docker-compose.yml` để trỏ về địa chỉ Backend (Ví dụ: `http://localhost:5000` hoặc domain Render).
3.  Chạy container frontend:
    ```bash
    docker-compose up -d --build
    ```

**Bước 3: Truy cập**
* Frontend: http://localhost:5173
* Backend API: http://localhost:5000

---

### Phương pháp 2: Chạy thủ công (Môi trường phát triển)

**Bước 1: Cài đặt và chạy Backend**:

  ```bash
  cd backend
  npm install
  npm run dev
  ```
    
**Bước 2: Cài đặt và chạy Backend**:

  ```bash
  cd frontend
  npm install
  npm run dev
  ```
    
**Bước 3: Copy file env.example và tạo file .env thực hiện cả ở Backend & Frontend**:

  ```bash
  cp .env.example .env
  ```
    
**Bước 4: Truy cập**:

* Frontend: http://localhost:5173
* Backend API: http://localhost:5000
