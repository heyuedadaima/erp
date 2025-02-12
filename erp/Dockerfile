# 使用官方的 Python 3.9 镜像作为基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 将 requirements.txt 复制到容器中的工作目录
COPY requirements.txt /app/

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 将应用代码复制到容器中
COPY . /app/

# 设置环境变量，告诉 Flask 在哪个主机和端口运行
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# 暴露 Flask 的默认端口
EXPOSE 5000

# 启动 Flask 应用
CMD ["flask", "run"]
