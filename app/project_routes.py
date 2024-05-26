from flask import request, jsonify
import html, os, uuid
from app import app
from app.project_model import ProjectModel
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads')
ALLOWWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWWED_EXTENSIONS

def validate_project_data(data):
    required_fields = [
        'project-client', 'project-name', 'project-description', 'project-start',
        'land-parcel-legal', 'land-parcel-street', 'land-parcel-subdivision', 
        'land-parcel-city', 'land-parcel-province', 'land-parcel-zipcode', 'land-parcel-area'
    ]
    
    for field in required_fields:
        if not data.get(field):
            return False, f"Field {field} is required."
    
    return True, ""

@app.route('/add-project', methods=['POST'])
def add_project():
    try:
        data = request.form.to_dict()
        
        # Validate required fields
        is_valid, message = validate_project_data(data)
        if not is_valid:
            return jsonify({"status": "error", "message": message}), 400
        
        # Sanitize inputs
        client_id = html.escape(data.get('project-client'))
        project_name = html.escape(data.get('project-name'))
        description = html.escape(data.get('project-description'))
        start_date = html.escape(data.get('project-start'))
        end_date = html.escape(data.get('project-end')) if data.get('project-end') else None
        legal_description = html.escape(data.get('land-parcel-legal'))
        street = html.escape(data.get('land-parcel-street'))
        subdivision = html.escape(data.get('land-parcel-subdivision'))
        city = html.escape(data.get('land-parcel-city'))
        province = html.escape(data.get('land-parcel-province'))
        zipcode = html.escape(data.get('land-parcel-zipcode'))
        area = html.escape(data.get('land-parcel-area'))
        surveyors = [html.escape(s) for s in request.form.getlist('surveyor_id')]
        
        image_urls = []
        upload_name = 'uploadedImage'
        if upload_name in request.files:
            files = request.files.getlist(upload_name)
            for file in files:
                if file and allowed_file(file.filename):
                    filename =  secure_filename(file.filename)
                    file_extension = filename.rsplit('.', 1)[1].lower()
                    ufilename = f"{uuid.uuid4()}.{file_extension}"
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], ufilename)
                    file.save(file_path)
                    image_urls.append(ufilename)
        
        project_model = ProjectModel()
        project_model.insert_project(client_id, project_name, description, start_date, end_date, legal_description, street, subdivision, city, province, zipcode, area, surveyors, image_urls)
        
        return jsonify({"status": "success", "message": "Project added successfully"})
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/projects', methods=['GET'])
def get_all_projects():
    try:
        project_model = ProjectModel()
        projects = project_model.fetch_all_projects()
        return jsonify(projects)
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/project/<int:id>', methods=['GET'])
def get_project(id):
    try:
        project_model = ProjectModel()
        project = project_model.fetch_project(id)
        return jsonify(project)
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/update-project/<int:id>', methods=['POST'])
def update_project(id):
    try:
        data = request.form.to_dict()
        
        # Validate required fields
        is_valid, message = validate_project_data(data)
        if not is_valid:
            return jsonify({"status": "error", "message": message}), 400
        
        # Sanitize inputs
        client_id = html.escape(data.get('project-client'))
        project_name = html.escape(data.get('project-name'))
        description = html.escape(data.get('project-description'))
        start_date = html.escape(data.get('project-start'))
        end_date = html.escape(data.get('project-end')) if data.get('project-end') else None
        legal_description = html.escape(data.get('land-parcel-legal'))
        street = html.escape(data.get('land-parcel-street'))
        subdivision = html.escape(data.get('land-parcel-subdivision'))
        city = html.escape(data.get('land-parcel-city'))
        province = html.escape(data.get('land-parcel-province'))
        zipcode = html.escape(data.get('land-parcel-zipcode'))
        area = html.escape(data.get('land-parcel-area'))
        surveyors = [html.escape(s) for s in request.form.getlist('surveyor_id')]
        
        image_urls = []
        upload_name = 'uploadedImage'
        if upload_name in request.files:
            files = request.files.getlist(upload_name)
            for file in files:
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    file_extension = filename.rsplit('.', 1)[1].lower()
                    ufilename = f"{uuid.uuid4()}.{file_extension}"
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], ufilename)
                    file.save(file_path)
                    image_urls.append(ufilename)
        
        project_model = ProjectModel()
        project_model.update_project(id, client_id, project_name, description, start_date, end_date, legal_description, street, subdivision, city, province, zipcode, area, surveyors, image_urls)
        
        return jsonify({"status": "success", "message": "Project updated successfully"})
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/delete-project/<int:id>', methods=['DELETE'])
def delete_project(id):
    try:
        project_model = ProjectModel()
        project_model.delete_project(id)
        return jsonify({"status": "success", "message": "Project deleted successfully"})
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/search', methods=['GET'])
def search():
  query = request.args.get('query', '')
  project_model = ProjectModel()
  return project_model.search_project(query)
  