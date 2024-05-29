from app.models import get_connection

class ProjectModel:
    def insert_project(self, client_id, project_name, description, start_date, end_date, legal_description, street, subdivision, city, province, zipcode, area, surveyors, image_urls):
        conn = get_connection()
        cursor = conn.cursor()

        # Check if Client_ID column exists in Land_Parcel table
        cursor.execute("SHOW COLUMNS FROM Land_Parcel LIKE 'Client_ID'")
        client_id_column_exists = cursor.fetchone()

        if client_id_column_exists:
            parcel_query = """INSERT INTO Land_Parcel (Client_ID, Legal_Description, Street, Subdivision, City, Province, ZipCode, area) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
            parcel_values = (client_id, legal_description, street, subdivision, city, province, zipcode, area)
        else:
            parcel_query = """INSERT INTO Land_Parcel (Legal_Description, Street, Subdivision, City, Province, ZipCode, area) VALUES (%s, %s, %s, %s, %s, %s, %s)"""
            parcel_values = (legal_description, street, subdivision, city, province, zipcode, area)

        cursor.execute(parcel_query, parcel_values)
        parcel_id = cursor.lastrowid

        project_query = """INSERT INTO Survey_Project (Name, Description, time_started, time_ended, Parcel_ID) VALUES (%s, %s, %s, %s, %s)"""
        project_values = (project_name, description, start_date, end_date, parcel_id)
        cursor.execute(project_query, project_values)
        project_id = cursor.lastrowid

        for surveyor in surveyors:
            cursor.execute("INSERT INTO Survey_Project_Surveyor (Survey_Project_ID, Surveyor_ID) VALUES (%s, %s)", (project_id, surveyor))

        for url in image_urls:
            cursor.execute("INSERT INTO Survey_Project_Image (Project_ID, Image_URL) VALUES (%s, %s)", (project_id, url))

        conn.commit()
        cursor.close()
        conn.close()

    def fetch_all_projects(self):
        conn = get_connection()
        cursor = conn.cursor()
        
        # Fetch all projects
        project_query = """SELECT sp.ID, sp.Name, c.full_name
                        FROM Survey_Project sp
                        JOIN Land_Parcel lp ON sp.Parcel_ID = lp.ID
                        JOIN Client_With_Fullname c ON c.ID = lp.Client_ID"""
        cursor.execute(project_query)
        datas = cursor.fetchall()
        projects = []

        for data in datas:
            column_header = [desc[0] for desc in cursor.description]
            project_data = dict(zip(column_header, data))
            print(project_data)  # Debugging line to print project data

            # Use a separate cursor for the image query
            image_cursor = conn.cursor()
            image_query = """SELECT ID, Image_URL FROM Survey_Project_Image WHERE Project_ID = %s LIMIT 1"""
            image_cursor.execute(image_query, (project_data['ID'],))
            image = image_cursor.fetchone()
            if image:
                project_data['image'] = {'id': image[0], 'url': image[1]}
            else:
                project_data['image'] = None
            image_cursor.close()

            projects.append(project_data)

        cursor.close()
        conn.close()
        return projects


    def fetch_project(self, id):
        conn = get_connection()
        cursor = conn.cursor()
        query = """SELECT sp.ID, sp.Name, sp.Description, sp.time_started, sp.time_ended, 
                          lp.Legal_Description, lp.Street, lp.Subdivision, lp.City, lp.Province, lp.ZipCode, lp.area,
                          c.id as client_id, c.first_name AS client_first_name, c.last_name AS client_last_name, c.contact_number AS client_contact_number, c.email AS client_email
                   FROM Survey_Project sp
                   JOIN Land_Parcel lp ON sp.Parcel_ID = lp.ID
                   JOIN Client c ON lp.Client_ID = c.ID
                   WHERE sp.ID = %s"""
        cursor.execute(query, (id,))
        data = cursor.fetchone()

        if data:
            column_header = [desc[0] for desc in cursor.description]
            project_data = dict(zip(column_header, data))

            # Fetch associated surveyors
            surveyor_query = """SELECT s.ID, s.full_name, s.email, s.title, s.contact_number
                FROM Survey_Project_Surveyor sps
                JOIN Surveyor_With_Fullname s on s.ID = sps.Surveyor_ID
                WHERE Survey_Project_ID = %s"""
            cursor.execute(surveyor_query, (id,))
            surveyors = cursor.fetchall()
            project_data['surveyors'] = [s for s in surveyors]

            # Fetch associated images
            image_query = """SELECT ID, Image_URL FROM Survey_Project_Image WHERE Project_ID = %s"""
            cursor.execute(image_query, (id,))
            images = cursor.fetchall()
            project_data['images'] = [{'id': img[0], 'url': img[1]} for img in images]
        else:
            project_data = None

        cursor.close()
        conn.close()
        return project_data

    def update_project(self, id, client_id, project_name, description, start_date, end_date, legal_description, street, subdivision, city, province, zipcode, area, surveyors, images):
        conn = get_connection()
        cursor = conn.cursor()

        # Update Land_Parcel
        land_parcel_query = """UPDATE Land_Parcel 
                            SET Client_ID = %s, Legal_Description = %s, Street = %s, Subdivision = %s, City = %s, Province = %s, ZipCode = %s, area = %s
                            WHERE ID = (SELECT Parcel_ID FROM Survey_Project WHERE ID = %s)"""
        land_parcel_values = (client_id, legal_description,
                            street, subdivision, city, province, zipcode, area, id)
        cursor.execute(land_parcel_query, land_parcel_values)

        # Update Survey_Project
        project_query = """UPDATE Survey_Project 
                        SET Name = %s, Description = %s, time_started = %s, time_ended = %s 
                        WHERE ID = %s"""
        project_values = (project_name, description,
                        start_date, end_date, id)
        cursor.execute(project_query, project_values)

        # Update Survey_Project_Surveyor
        cursor.execute(
            "DELETE FROM Survey_Project_Surveyor WHERE Survey_Project_ID = %s", (id,))
        for surveyor_id in surveyors:
            surveyor_query = """INSERT INTO Survey_Project_Surveyor 
                                (Surveyor_ID, Survey_Project_ID) 
                                VALUES (%s, %s)"""
            cursor.execute(surveyor_query, (surveyor_id, id))

        # Update Survey_Project_Image only if images are uploaded
        if images:
            cursor.execute(
                "DELETE FROM Survey_Project_Image WHERE Project_ID = %s", (id,))
            for image in images:
                image_query = """INSERT INTO Survey_Project_Image 
                                (Project_ID, Image_URL) 
                                VALUES (%s, %s)"""
                cursor.execute(image_query, (id, image))

        conn.commit()
        cursor.close()
        conn.close()


    def delete_project(self, id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "DELETE FROM Survey_Project WHERE ID = %s"
        cursor.execute(query, (id,))
        conn.commit()
        cursor.close()
        conn.close()
        
    def search_project(self, args):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        if args:
            query =  """SELECT sp.ID, sp.Name, sp.Description, spi.Image_URL 
                FROM Survey_Project sp
                LEFT JOIN (
                    SELECT Project_ID, MIN(Image_URL) as Image_URL
                    FROM Survey_Project_Image
                    GROUP BY Project_ID
                ) spi ON sp.ID = spi.Project_ID
                WHERE sp.Name LIKE %s OR sp.Description LIKE %s
                ORDER BY LENGTH(GREATEST(sp.Name, sp.Description)) DESC
            """
            cursor.execute(query, (f"%{args}%", f"%{args}%"))
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            results_html = ""
            for project in results:
                shortened_description = (project['Description'][:100] + '...') if len(project['Description']) > 100 else project['Description']
                image_url = 'static/uploads/' + project['Image_URL'] if project['Image_URL'] else 'static/images/no-image.png'
                results_html += f"""
                    <div class="card border-0 bg-transparent">
                        <div class="trigger-view row no-gutters m-auto" data-id="{project['ID']}" data-bs-target="#projectViewModal" data-bs-toggle="modal">
                            <div class="col-md-3">
                                <img style="width: 80px; height: 80px; object-fit: cover; object-position: bottom;" src="{image_url}" class="card-img" alt="Project Image">
                            </div>
                            <div class="col-md-9">
                                <div class="card-body">
                                    <h5 class="card-title">{project['Name']}</h5>
                                    <p class="card-text">{shortened_description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                """
            return results_html
        return ''
