from flask import Blueprint, jsonify, request

# Blueprint を作成
example_bp = Blueprint('example', __name__)

# GET リクエストの例
@example_bp.route('/api/example', methods=['GET'])
def get_example():
    return jsonify({"message": "Hello from Flask!"})

# POST リクエストの例
@example_bp.route('/api/example', methods=['POST'])
def post_example():
    data = request.get_json()
    return jsonify({"received": data})
