from flask import Flask
from flask_cors import CORS

# Flask アプリケーションを初期化
app = Flask(__name__)
CORS(app)  # フロントエンドとの通信を許可

# ルートをインポート
from routes import init_routes
init_routes(app)

if __name__ == "__main__":
    app.run(debug=True)