# Sử dụng node phiên bản LTS làm base image
FROM node:20-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy các file quản lý thư viện trước để tận dụng Docker cache
COPY package*.json ./

# Cài đặt thư viện
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Biên dịch TypeScript sang JavaScript (vì bạn đang dùng ts-node/dist)
RUN npm run build

# Mở cổng 5000 (giống port server đang chạy trong ảnh)
EXPOSE 5000

# Lệnh khởi chạy ứng dụng
CMD ["npm", "start"]