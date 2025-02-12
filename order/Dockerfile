# 使用官方的 Node.js 16 镜像作为基础镜像
FROM node:16 AS build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到容器中（利用 Docker 缓存机制）
COPY package*.json /app/

# 安装前端依赖
RUN npm install

# 复制前端代码到容器中
COPY . /app/

# 确保 node_modules 具有正确的权限
RUN chmod -R 755 /app/node_modules

# 构建前端应用
RUN npm run build

# 使用官方的 nginx 镜像来提供构建后的前端文件
FROM nginx:alpine AS production-stage

# 删除默认的 Nginx 配置文件
RUN rm /etc/nginx/conf.d/default.conf

# 复制构建好的前端文件到 nginx 的静态文件目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露 Nginx 的默认端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
