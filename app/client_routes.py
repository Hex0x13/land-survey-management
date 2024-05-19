from flask import request, jsonify
from app import app
from app.models import ClientModel
import html


client = ClientModel()


@app.route('/api/add-client', methods=['POST'])
def add_client():
    try:
        fname = html.escape(request.form.get('fname'))
        lname = html.escape(request.form.get('lname'))
        mname = html.escape(request.form.get('mname'))
        name_ext = html.escape(request.form.get('name_ext'))
        email = html.escape(request.form.get('email'))
        contact_number = html.escape(request.form.get('contact_number'))
        client.insert_data(fname, lname, mname, name_ext, contact_number, email)
        return jsonify({'success': 'Client data inserted successfuly!'})
    except Exception as error:
        return jsonify({'error': str(error)}), 400


@app.route('/api/get-clients', methods=['GET'])
def get_clients():
    try:
        data = client.fetch_all_data()
        return jsonify(data)
    except Exception as error:
        return jsonify({'error': str(error)}), 400


@app.route('/api/get-client', methods=['GET'])
def get_client():
    try:
        id = int(request.args.get('id'))
        data = client.fetch_data(id)
        return jsonify(data)
    except Exception as error:
        return jsonify({'error': str(error)})


@app.route('/api/delete-client', methods=['DELETE'])
def delete_client():
    try:
        id = int(request.args.get('id'))
        client.delete_data(id)
        return jsonify({'success': 'Deletion Success'})
    except Exception as error:
        return jsonify({'error': str(error)}), 400


@app.route('/api/update-client', methods=['PATCH'])
def update_client():
    try:
        id = int(request.form.get('id'))
        fname = html.escape(request.form.get('fname'))
        lname = html.escape(request.form.get('lname'))
        mname = html.escape(request.form.get('mname'))
        name_ext = html.escape(request.form.get('name_ext'))
        email = html.escape(request.form.get('email'))
        contact_number = html.escape(request.form.get('contact_number'))
        client.update_data(id, fname, lname, mname, name_ext, contact_number, email)
        return jsonify({'success': 'updated successfuly'})
    except Exception as error:
        return jsonify({'error': str(error)})
