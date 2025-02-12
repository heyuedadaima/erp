from flask import Flask, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, World!"  # 根路径返回Hello, World!

# 数据库连接配置
db_config = {
    'host': 'localhost',  # 数据库服务器地址，通常是 localhost
    'user': 'root',  # 数据库用户名
    'password': '123456',  # 数据库密码
    'database': 'erp'  # 数据库名称
}

@app.route('/api/get-products', methods=['GET'])
def get_products():
    try:
        # 建立数据库连接
        connection = mysql.connector.connect(**db_config)

        # 如果连接成功
        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            # 执行 SQL 查询，查询 product 表中的 name 和 address
            cursor.execute("SELECT name, address FROM product")

            # 获取所有结果
            products = cursor.fetchall()

            # 返回 JSON 格式的数据
            return jsonify(products)

    except Error as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # 关闭数据库连接
        if connection.is_connected():
            cursor.close()
            connection.close()



if __name__ == '__main__':
    app.run(debug=True)
