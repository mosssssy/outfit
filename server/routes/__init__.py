from flask import Blueprint
from routes.example import example_bp

def init_routes(app):
    # Blueprint を登録
    app.register_blueprint(example_bp)
