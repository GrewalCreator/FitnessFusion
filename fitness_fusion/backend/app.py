from flask import Flask, request, render_template, jsonify
import configparser
import os
import psycopg2
from psycopg2.errors import UndefinedTable
from dotenv import load_dotenv
from yaml import safe_load as yload
from psycopg2.errors import UndefinedTable

from security import Cryptography
from custom_errors import *
import re
from flask_bcrypt import Bcrypt



app = Flask(__name__)
bcrypt = Bcrypt(app)
security = Cryptography(bcrypt)

# Ensure The Following Section is generated prior to load_dotenv()
config = configparser.ConfigParser()
config.read('config.ini')

PASSWORD = config['Password']['password']
os.environ['PASSWORD'] = PASSWORD

load_dotenv()

url = os.getenv("DATABASE_URL")
print(url)
if url:
    url = url.replace("$PASSWORD", PASSWORD)


#######################################################################################################################

@app.route("/test")
def index():
    return {"object":["1", "2", "3"]}


#######################################################################################################################


@app.route("/setup", methods=['POST'])
def setup_db():
    with psycopg2.connect(url) as connection:
        try:
            
            with connection.cursor() as cursor:
                with open("init.sql", "r") as init_file:
                    sql_queries = init_file.read()
                    cursor.execute(sql_queries)
            return {"message": "Initial Table & Values Generated Successfully"}, 201

        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500


@app.route("/purge_cleanup", methods=['DELETE'])
def purge():
    with psycopg2.connect(url) as connection:
        try:
            
            with connection.cursor() as cursor:
                with open("del.sql", "r") as init_file:
                    sql_queries = init_file.read()
                    cursor.execute(sql_queries)
            return {"message": "All Tables & Data Purged Successfully"}, 200
        
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500




#######################################################################################################################

@app.route("/login", methods=['POST'])
def login():
    loginFields = ['email', 'password']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            if any(field not in data for field in loginFields):
                raise MISSING_ENTRY
            
            with open("queries.yaml") as file_object:
                parsed_yaml = yload(file_object)
                sql_email_search = parsed_yaml["sql"]["searchByEmail"]

            
            with connection.cursor() as cursor:
                cursor.execute(sql_email_search, (data['email'],))
                if cursor.rowcount == 0:
                    raise EMAIL_NOT_FOUND
                
                columns = [desc[0] for desc in cursor.description]
                row = cursor.fetchone()
                password_index = columns.index('password')
                stored_password = row[password_index]
                if security.verify_password(data['password'], stored_password) == True:
                    connection.commit()
                    return jsonify({"message": "Member Logged-In Successfully"}), 200
                else:
                    raise INVALID_PASSWORD

        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code
        
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500

#######################################################################################################################
    

def addClient(member_id):
    with psycopg2.connect(url) as connection:
        try:

            with open("queries.yaml") as file_object:
                parsed_yaml = yload(file_object)
                sql_client_insert = parsed_yaml["sql"]["addClient"]


            
            with connection.cursor() as cursor:
                cursor.execute(sql_client_insert, (member_id,))
                if cursor.rowcount == 0:
                    raise MEMBER_ID_NOT_FOUND
                else:
                    connection.commit()
                    return jsonify({"message": "Client added successfully"}), 201
                    

        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code

        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500

####################################################

@app.route("/addMember", methods=['POST'])
def addMember():
    registerFields = ['first_name', 'last_name', 'email', 'password', 'date_of_birth', 'gender', 'member_type']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            if any(field not in data for field in registerFields):
                raise MISSING_ENTRY
                

            hashed_pswd = security.hash_password(data['password'])

            gender_char = convert_gender(data['gender'])
            if gender_char == None:
                raise INVALID_GENDER
            
            if validate_email(data['email']) == False:
                raise INVALID_EMAIL

            member_type = convert_member_type(data['member_type'])
            if member_type == None:
                raise INVALID_MEMBER_TYPE
        
            with open("queries.yaml") as file_object:
                parsed_yaml = yload(file_object)
                sql_member_insert = parsed_yaml["sql"]["addMember"]
                
            
            
            with connection.cursor() as cursor:
                cursor.execute(sql_member_insert, (data['first_name'], data['last_name'], data['email'], hashed_pswd, data['date_of_birth'], gender_char, data['member_type']))
                connection.commit()
                member_id = cursor.fetchone()[0]
                if cursor.rowcount == 0:
                    raise EMAIL_UNAVAILABLE

                
                if member_type == "Client":
                    response_body, exit_status = addClient(member_id)
                    if exit_status != 201:
                        return response_body, exit_status

                    
                    
                    

            return jsonify({"message": "Member added successfully"}), 201
            
        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code
        
        except UndefinedTable as e:
            error_message = "Error: Tables do not exist in the database."
            return jsonify({'error': error_message}), 500
        
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500
    
####################################################

def convert_gender(val: str):
    val = val.lower()
    genders = {
        "male": 'M',
        "female": 'F',
        "other": 'O',
        "m": 'M',
        "f": 'F',
        "o": 'O'
    }

    return genders.get(val)

####################################################


def validate_email(email: str):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

####################################################
 
def convert_member_type(member_type: str):
    member_type = member_type.lower()
    members = {
        "client":"Client",
        "trainer":"Trainer",
        "admin-staff":"Admin-Staff"
    }

    return members.get(member_type)

#######################################################################################################################

@app.route("/updateEmail", methods=['PUT'])
def updateEmail():
    updateEmailFields = ['oldEmail', 'newEmail']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            if any(field not in data for field in updateEmailFields):
                raise MISSING_ENTRY
            
            if data['newEmail'] == data['oldEmail']:
                raise BAD_INPUT
            
            if not validate_email(data['newEmail']):
                raise INVALID_EMAIL

            with open("queries.yaml") as file_object:
                parsed_yaml = yload(file_object)
                sql_email_search = parsed_yaml["sql"]["searchByEmail"]
                sql_email_update = parsed_yaml["sql"]["updateEmail"]
                
            
            
            with connection.cursor() as cursor:
                cursor.execute(sql_email_search, (data['oldEmail'],))
                old_email_row = cursor.fetchone()

                if old_email_row is None:
                    raise EMAIL_NOT_FOUND

                
                cursor.execute(sql_email_search, (data['newEmail'],))
                new_email_row = cursor.fetchone()
                if new_email_row is not None:
                    raise EMAIL_UNAVAILABLE

                
                cursor.execute(sql_email_update, (data['newEmail'], data['oldEmail']))
                connection.commit()

                
                
                return jsonify({"message": "Email changed successfully"}), 201
                
        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code
        
        except UndefinedTable as e:
            error_message = "Error: Tables do not exist in the database."
            return jsonify({'error': error_message}), 500
        
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500




@app.route("/updatePassword", methods=['PUT'])
def updatePassword():
    updatePasswordFields = ['email', 'oldPassword', 'newPassword']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            if any(field not in data for field in updatePasswordFields):
                raise MISSING_ENTRY
            
            if data['newPassword'] == data['oldPassword']:
                raise BAD_INPUT

            with open("queries.yaml") as file_object:
                parsed_yaml = yload(file_object)
                sql_email_search = parsed_yaml["sql"]["searchByEmail"]
                sql_password_update = parsed_yaml["sql"]["updatePassword"]
                
            
            
            with connection.cursor() as cursor:
                cursor.execute(sql_email_search, (data['email'],))
                email_row = cursor.fetchone()

                if email_row is None:
                    raise EMAIL_NOT_FOUND
                
                columns = [desc[0] for desc in cursor.description]
                
                hashed_password = security.hash_password(data['newPassword'])

                password_index = columns.index('password')
                stored_password = email_row[password_index]
                if security.verify_password(data['oldPassword'], stored_password) == True:
                    cursor.execute(sql_password_update, (hashed_password, data['email']))
                    connection.commit()
                    return jsonify({"message": "Password changed successfully"}), 201
                else:
                    raise INVALID_PASSWORD
                
        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code
        
        except UndefinedTable as e:
            error_message = "Error: Tables do not exist in the database."
            return jsonify({'error': error_message}), 500
    
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500



# Get All Members
@app.route("/getAllMembers", methods=['GET'])
def getAllStudents():
    try:
        with psycopg2.connect(url) as connection:
            with connection.cursor() as cursor:
                with open("queries.yaml") as file_object:
                    parsed_yaml = yload(file_object)
                    cursor.execute(parsed_yaml["sql"]["getAllMembers"])
                    data = cursor.fetchall()
                    return jsonify(data), 200;
    except UndefinedTable as e:
        error_message = "Error: Tables do not exist in the database."
        return jsonify({'error': error_message}), 500

# Get All Clients

# Get Members By Name

# Get Members Goals

# Get Members Fitness Stats

# Get Members Health Stats

