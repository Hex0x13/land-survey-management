from flask import jsonify, request
from app import app

@app.route('/api/test', methods=['POST'])
def get_data():
  data = request.form
  json_data = {k: data[k] for k in data}
  return jsonify(json_data)
