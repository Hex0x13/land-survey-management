from flask import current_app
import mysql.connector as msqlcon


def get_connection() -> msqlcon.MySQLConnection:
    db_config = current_app.config.get('MYSQL_DB')
    conn = msqlcon.connect(**db_config)
    return conn


class SurveyorModel:
    def insert_data(self, fname, lname, mname, name_ext, title, contact_number, email):
        if not all([fname, lname, email, title, contact_number]):
            raise ValueError("Required fields are missing")

        conn = get_connection()
        cursor = conn.cursor()
        query = """INSERT INTO Surveyor 
    (first_name, last_name, middle_name, name_extension, title, contact_number, email)
    VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        values = (fname, lname, mname, name_ext, title, contact_number, email)
        cursor.execute(query, values)
        conn.commit()
        conn.close()
        cursor.close()
        conn.close()

    def fetch_all_data(self):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT * FROM Surveyor_With_Fullname"
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return data

    def delete_data(self, id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "DELETE FROM Surveyor WHERE id = %s"
        cursor.execute(query, (id,))
        conn.commit()
        cursor.close()
        conn.close()

    def update_data(self, id, fname, lname, mname, name_ext, title, contact_number, email):
        conn = get_connection()
        cursor = conn.cursor()
        query = "CALL Edit_Surveyor(%s, %s, %s, %s, %s, %s, %s, %s)"
        values = (id, fname, lname, mname, name_ext,
                  title, contact_number, email)
        cursor.execute(query, values)
        conn.commit()
        conn.close()
        cursor.close()

    def fetch_data(self, id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT * FROM Surveyor WHERE id = %s"
        cursor.execute(query, (id, ))
        data = cursor.fetchone()
        column_header = [desc[0] for desc in cursor.description]
        assoc_data = dict(zip(column_header, data))
        cursor.close()
        conn.close()
        return assoc_data


class ClientModel:
    def insert_data(self, fname, lname, mname, name_ext, contact_number, email):
        if not all([fname, lname, email, contact_number]):
            raise ValueError("Required fields are missing")

        conn = get_connection()
        cursor = conn.cursor()
        query = """INSERT INTO Client 
    (first_name, last_name, middle_name, name_extension, contact_number, email)
    VALUES (%s, %s, %s, %s, %s, %s)"""
        values = (fname, lname, mname, name_ext, contact_number, email)
        cursor.execute(query, values)
        conn.commit()
        conn.close()
        cursor.close()
        conn.close()

    def fetch_all_data(self):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT * FROM Client_With_Fullname"
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return data

    def delete_data(self, id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "DELETE FROM Client WHERE id = %s"
        cursor.execute(query, (id,))
        conn.commit()
        cursor.close()
        conn.close()

    def update_data(self, id, fname, lname, mname, name_ext, contact_number, email):
        conn = get_connection()
        cursor = conn.cursor()
        query = "CALL Edit_Client(%s, %s, %s, %s, %s, %s, %s)"
        values = (id, fname, lname, mname, name_ext, contact_number, email)
        cursor.execute(query, values)
        conn.commit()
        conn.close()
        cursor.close()

    def fetch_data(self, id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT * FROM Client WHERE id = %s"
        cursor.execute(query, (id, ))
        data = cursor.fetchone()
        column_header = [desc[0] for desc in cursor.description]
        assoc_data = dict(zip(column_header, data))
        cursor.close()
        conn.close()
        return assoc_data


class User:
    def get_surveyor_id_by_email(self, email):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT ID FROM Surveyor WHERE email = %s"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result[0] if result else None

    def insert_user(self, email, password):
        surveyor_id = self.get_surveyor_id_by_email(email)
        if surveyor_id is None:
            raise Exception("Surveyor with this email does not exist.")
        conn = get_connection()
        cursor = conn.cursor()
        query = "INSERT INTO User (password, surveyor_id) VALUES (%s, %s)"
        cursor.execute(query, (password, surveyor_id))
        conn.commit()
        cursor.close()
        conn.close()
        return cursor.lastrowid

    def select_user(self, email, password):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT u.id, s.email, u.surveyor_id FROM User u JOIN Surveyor s WHERE s.email = %s AND u.password = %s"
        cursor.execute(query, (email, password))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result
