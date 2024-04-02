from flask import Flask, request, render_template, jsonify
import configparser
import os
import psycopg2
from dotenv import load_dotenv
from yaml import safe_load as yload

from security import hash_password, verify_password
from custom_errors import *
import re




app = Flask(__name__)


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




@app.route("/test")
def index():
    return {"object":["1", "2", "3"]}


@app.route("/setup", methods=['POST'])
def setup_db():
    try:
        with psycopg2.connect(url) as connection:
            with connection.cursor() as cursor:
                with open("init.sql", "r") as init_file:
                    sql_queries = init_file.read()
                    cursor.execute(sql_queries)
        return {"message": "Initial Table & Values Generated Successfully"}, 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/purge_cleanup", methods=['DELETE'])
def purge():
    try:
        with psycopg2.connect(url) as connection:
            with connection.cursor() as cursor:
                with open("del.sql", "r") as init_file:
                    sql_queries = init_file.read()
                    cursor.execute(sql_queries)
        return {"message": "All Tables & Data Purged Successfully"}, 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def addClient(member_id):
    try:

        with open("queries.yaml") as file_object:
            parsed_yaml = yload(file_object)
            sql_client_insert = parsed_yaml["sql"]["addClient"]


        with psycopg2.connect(url) as connection:
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



@app.route("/addMember", methods=['POST'])
def addMember():
    registerFields = ['first_name', 'last_name', 'email', 'password', 'date_of_birth', 'gender', 'member_type']
    try:
        data = request.json
        if any(field not in data for field in registerFields):
            raise MISSING_ENTRY
            

        hashed_pswd = hash_password(data['password'])

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
            
        
        with psycopg2.connect(url) as connection:
            with connection.cursor() as cursor:
                cursor.execute(sql_member_insert, (data['first_name'], data['last_name'], data['email'], hashed_pswd, data['date_of_birth'], gender_char, data['member_type']))
                connection.commit()
                member_id = cursor.fetchone()[0]
                if cursor.rowcount == 0:
                    raise EMAIL_UNAVAILABLE

                
                if member_type == "Client":
                    addClient(member_id)
                
                
                

        return jsonify({"message": "Member added successfully"}), 201
        
    except Error as e:
        return jsonify({'error': e.to_dict()}), e.code
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    


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

def validate_email(email: str):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))
    
def convert_member_type(member_type: str):
    member_type = member_type.lower()
    members = {
        "client":"Client",
        "trainer":"Trainer",
        "admin-staff":"Admin-Staff"
    }

    return members.get(member_type)