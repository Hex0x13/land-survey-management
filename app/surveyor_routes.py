from flask import request, jsonify
from app import app
from app.models import SurveyorModel
import html


surveyor = SurveyorModel()


@app.route('/api/add-surveyor', methods=['POST'])
def add_surveryor():
    try:
        fname = html.escape(request.form.get('fname'))
        lname = html.escape(request.form.get('lname'))
        mname = html.escape(request.form.get('mname'))
        name_ext = html.escape(request.form.get('name_ext'))
        email = html.escape(request.form.get('email'))
        title = html.escape(request.form.get('title'))
        contact_number = html.escape(request.form.get('contact_number'))
        surveyor.insert_data(fname, lname, mname, name_ext,
                             title, contact_number, email)
        return jsonify({'success': 'Surveyor data inserted successfuly!'})
    except Exception as error:
        return jsonify({'error': str(error)}), 400


@app.route('/api/get-surveyors', methods=['GET'])
def get_surveyors():
    try:
        data = surveyor.fetch_all_data()
        return jsonify(data)
    except Exception as error:
        return jsonify({'error': str(error)}), 400


@app.route('/api/get-surveyor', methods=['GET'])
def get_surveyor():
    try:
        id = int(request.args.get('id'))
        data = surveyor.fetch_data(id)
        return jsonify(data)
    except Exception as error:
        return jsonify({'error': str(error)})


@app.route('/api/delete-surveyor', methods=['DELETE'])
def delete_surveyor():
    try:
        id = int(request.args.get('id'))
        surveyor.delete_data(id)
        return jsonify({'success': 'Deletion Success'})
    except Exception as error:
        return jsonify({'error': str(error)}), 400


@app.route('/api/update-surveyor', methods=['PATCH'])
def update_surveyor():
    try:
        id = int(request.form.get('id'))
        fname = html.escape(request.form.get('fname'))
        lname = html.escape(request.form.get('lname'))
        mname = html.escape(request.form.get('mname'))
        name_ext = html.escape(request.form.get('name_ext'))
        email = html.escape(request.form.get('email'))
        title = html.escape(request.form.get('title'))
        contact_number = html.escape(request.form.get('contact_number'))
        surveyor.update_data(id, fname, lname, mname,
                             name_ext, title, contact_number, email)
        return jsonify({'success': 'updated successfuly'})
    except Exception as error:
        return jsonify({'error': str(error)})
