from flask import Flask, request, render_template, jsonify
import configparser
import os
import psycopg2
from psycopg2.errors import UndefinedTable
from dotenv import load_dotenv
from yaml import safe_load as yload

from security import Cryptography
from custom_errors import *
import re
from flask_bcrypt import Bcrypt

import threading
import time
import sys

security = None


def billing_simulator():
    
    while True:
        time.sleep(30)  # How Often Client Should Be Billed
        with psycopg2.connect(url) as connection:
            try:
                with connection.cursor() as cursor:
                    sql_charge = get_query("chargeAllClients")
                    cursor.execute(sql_charge)
                    connection.commit()
            except Exception as e:
                connection.rollback()
                return jsonify({"error": str(e)}), 500
            


def create_app():
    global security
    app = Flask(__name__)
    bcrypt = Bcrypt(app)
    security = Cryptography(bcrypt)

    
    bill_simulation_thread = threading.Thread(target=billing_simulator)
    bill_simulation_thread.daemon = True
    bill_simulation_thread.start()
    if not bill_simulation_thread.is_alive():
        print("Background Thread Failed To Launch")
        sys.exit(1)
    return app

app = create_app()

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
    data = request.json
    return verifyAccount(data)

#######################################################################################################################
    

def addClient(member_id):
    with psycopg2.connect(url) as connection:
        try:

            sql_client_insert = get_query("addClient")

            
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
    requiredFields = ['first_name', 'last_name', 'email', 'password', 'date_of_birth', 'gender', 'member_type']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            verifyBody(data, requiredFields)
                

            hashed_pswd = security.hash_password(data['password'])

            gender_char = convert_gender(data['gender'])
            if gender_char == None:
                raise INVALID_GENDER
            
            if validate_email(data['email']) == False:
                raise INVALID_EMAIL

            member_type = convert_member_type(data['member_type'])
            if member_type == None:
                raise INVALID_MEMBER_TYPE
        

            sql_member_insert = get_query("addMember")
            
            
            with connection.cursor() as cursor:
                cursor.execute(sql_member_insert, (data['first_name'], data['last_name'], data['email'], hashed_pswd, data['date_of_birth'], gender_char, member_type))
                connection.commit()
                
                if cursor.rowcount == 0:
                    raise EMAIL_UNAVAILABLE
                member_id = cursor.fetchone()[0]

                
                if member_type == "Client":
                    response_body, exit_status = addClient(member_id)
                    if exit_status != 201:
                        return response_body, exit_status

                    
                    
                    

            return jsonify({"message": "Member added successfully"}), 201
            
        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code
        
        except UndefinedTable as e:
            error_message = "Error: Tables do not exist in the database. Reload The Page"
            setup_db()
            return jsonify({'error': error_message}), 500
        
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500
    
#######################################################################################################################

@app.route("/updateEmail", methods=['PUT'])
def updateEmail():
    requiredFields = ['oldEmail', 'newEmail']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            verifyBody(data, requiredFields)
            
            if data['newEmail'] == data['oldEmail']:
                raise BAD_INPUT
            
            if not validate_email(data['newEmail']):
                raise INVALID_EMAIL

            sql_email_search = get_query("searchMembersByEmail")
            sql_email_update = get_query("updateEmail")
                
            
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
            error_message = "Error: Tables do not exist in the database. Reload The Page"
            setup_db()
            return jsonify({'error': error_message}), 500
        
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500

#######################################################################################################################


@app.route("/updatePassword", methods=['PUT'])
def updatePassword():
    requiredFields = ['email', 'password', 'newPassword']
    data = request.json
    with psycopg2.connect(url) as connection:
        try:

            verifyBody(data, requiredFields)

            if data['newPassword'] == data['password']:
                raise BAD_INPUT   

            json, code = verifyAccount(data)
            if not (code >= 200 and code < 300):
                return json, code   
    
            sql_password_update = get_query("updatePassword")
            
            with connection.cursor() as cursor:
                hashed_password = security.hash_password(data['newPassword'])
                cursor.execute(sql_password_update, (hashed_password, data['email']))
                connection.commit()
                return jsonify({"message": "Password changed successfully"}), 201
          
                
        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code
        
        except UndefinedTable as e:
            error_message = "Error: Tables do not exist in the database. Reload The Page"
            setup_db()
            return jsonify({'error': error_message}), 500
    
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500

#######################################################################################################################

# Pay Account Balance
@app.route("/payAccountBalance", methods=['PUT'])
def payAccountBalance():
    requiredFields = ['payment', 'email']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            verifyBody(data, requiredFields)
            payment = data['payment']
            if not (isinstance(payment, (float, int)) and payment > 0):
                raise BAD_INPUT
            
            sql_email_search = get_query("searchClientsByEmail")
            sql_update_balance = get_query("payAccountBalance")
            with connection.cursor() as cursor:
                cursor.execute(sql_email_search, (data['email'],))
                email_row = cursor.fetchone()

                if email_row is None:
                    raise EMAIL_NOT_FOUND

                cursor.execute(sql_update_balance, (payment, data['email'],))

                if cursor.rowcount == 0:
                    raise PAYMENT_FAILED
                
                connection.commit()
                return jsonify({"message": "Payment Processed successfully"}), 201

        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code
            
        except UndefinedTable as e:
            error_message = "Error: Tables do not exist in the database. Reload The Page"
            setup_db()
            return jsonify({'error': error_message}), 500
        
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500

#######################################################################################################################

# Delete Member Account
@app.route("/deleteMemberAccount", methods=['DELETE'])
def deleteMemberAccount():
    
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            json, code = verifyAccount(data)
            if not (code >= 200 and code < 300):
                return json, code
        
            sql_delete_member = get_query("deleteMember")
            with connection.cursor() as cursor:
                cursor.execute(sql_delete_member, (data['email'],))
                if cursor.rowcount == 0:
                    raise DELETE_FAILED
            
                connection.commit()
                return jsonify({"message": "Deletion Commited Successfully"}), 200

        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code
            
        except UndefinedTable as e:
            error_message = "Error: Tables do not exist in the database. Reload The Page"
            setup_db()
            return jsonify({'error': error_message}), 500
        
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500
            
#######################################################################################################################

# Get All Members
@app.route("/getAllMembers", methods=['GET'])
def getAllMembers():
    return getAll("member")


@app.route("/getMemberType", methods=['GET'])
def getMemberType():
    requiredFilds = ['email']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            verifyBody(data, requiredFilds)

            sql_member_type = get_query("getMemberType")
            with connection.cursor() as cursor:
                cursor.execute(sql_member_type, (data['email'],))
                data = cursor.fetchone()
                if data == None:
                    raise EMAIL_NOT_FOUND
                return jsonify(data), 200
        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code
            
        except UndefinedTable as e:
            error_message = "Error: Tables do not exist in the database. Reload The Page"
            setup_db()
            return jsonify({'error': error_message}), 500
        
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500

# Get All Clients
@app.route("/getAllClients", methods=['GET'])
def getAllClients():
    return getAll("client")

# Get Clients By Name
@app.route("/searchClientsByName", methods=['GET'])
def searchClients():
    data = request.json
    return searchByName(data, "searchClientsByName")
    
        
# Get Members By Name
@app.route("/searchMembersByName", methods=['GET'])
def searchMembers():
    data = request.json
    return searchByName(data, "searchMembersByName")


# Get Clients Account Balance
@app.route("/getAllClientBalance", methods=['GET'])
def getAllClientBalance():
    return getAll("client-all-balance")

@app.route("/getClientBalance", methods=['GET'])
def getClientBalance():
    data = request.json
    return searchByName(data, "getClientBalanceByName")

# Set Clients Goals

# Get Clients Goals

# Get Clients Fitness Stats

# Get Clients Health Stats

#######################################################################################################################

def getAll(userType:str):
    userType.lower()
    types  = {"member":"getAllMembers", "client":"getAllClients", "trainer":"getAllTrainers", "admin-staff":"getAllAdminStaff", "client-all-balance":"getAllClientBalance"}
    if userType not in types:
        return 
    try:
        with psycopg2.connect(url) as connection:
            with connection.cursor() as cursor:

                sql_query = get_query(types.get(userType))
                
                cursor.execute(sql_query)
                data = cursor.fetchall()
                return jsonify(data), 200
    except UndefinedTable as e:
        error_message = "Error: Tables do not exist in the database. Reload The Page"
        setup_db()
        return jsonify({'error': error_message}), 500
    

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

####################################################

def get_query(queryName: str):
    with open("queries.yaml") as file_object:
        parsed_yaml = yload(file_object)
        sql_query = parsed_yaml["sql"].get(queryName)
        if sql_query is None:
            raise INVALID_QUERY
    return sql_query


def verifyBody(data: dict, requirements: list):
    if any(field not in data for field in requirements):
        raise MISSING_ENTRY
    
    
    email = data.get("email")
    if (email is not None) and (not validate_email(email)):
        raise INVALID_EMAIL

    return True


def searchByName(data:dict, query:str):
    requirements = ["name"]
    with psycopg2.connect(url) as connection:
        try:
            
            verifyBody(data, requirements)

            sql_query = get_query(query)

            with connection.cursor() as cursor:
                fullName = data['name'].lower().split(" ")
                if len(fullName) == 2:
                    firstName = fullName[0]
                    lastName = fullName[1]
                    cursor.execute(sql_query, ('%' + firstName + '%', '%' + lastName + '%',))
                else:
                    cursor.execute(sql_query, ('%' + fullName[0] + '%', '%' + fullName[0] + '%'))

                data = cursor.fetchall()
                return jsonify(data), 200

        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code


        except UndefinedTable as e:
            error_message = "Error: Tables do not exist in the database. Reload The Page"
            setup_db()
            return jsonify({'error': error_message}), 500

        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500


def verifyAccount(data:dict):
    
    requiredFields = ['email', 'password']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            verifyBody(data, requiredFields)
            sql_email_search = get_query("getMemberPasswordByEmail")
            
            
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
                    return jsonify({"message": "Member Verified Successfully"}), 200
                else:
                    raise INVALID_PASSWORD

        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code
        
        except UndefinedTable as e:
            error_message = "Error: Tables do not exist in the database. Reload The Page"
            setup_db()
            return jsonify({'error': error_message}), 500
        
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500
   