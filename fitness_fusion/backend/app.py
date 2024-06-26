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
from datetime import datetime, timedelta

security = None


def billing_simulator():
    
    while True:
        time.sleep(10)  # How Often Client Should Be Billed
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
                with open("./SQL/init.sql", "r") as init_file:
                    sql_queries = init_file.read()
                    cursor.execute(sql_queries)
                
                with open("./SQL/dummyData.sql", "r") as data_file:
                    sql_queries = data_file.read()
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
                with open("./SQL/del.sql", "r") as init_file:
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
    requiredFields = ['oldEmail', 'newEmail', 'password']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            verifyBody(data, requiredFields)
            json, code = verifyAccount({'email': data['oldEmail'], 'password': data['password']})
            if not (code >= 200 and code < 300):
                return json, code
            
            if data['newEmail'] == data['oldEmail']:
                raise BAD_INPUT
            
            if not validate_email(data['newEmail']):
                raise INVALID_EMAIL

            sql_email_search = get_query("searchMembersByEmail")
            sql_email_update = get_query("updateEmail")
                
            
            with connection.cursor() as cursor:
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
            payment = float(data['payment'])
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


@app.route("/completeGoal", methods=['PUT'])
def completeGoal():
    requiredFields = ['email', 'type', 'target', 'dateTime']
    with psycopg2.connect(url) as connection:
        data = request.json
        verifyBody(data, requiredFields)
        try:
            date_time_obj = datetime.strptime(data['dateTime'], "%Y-%m-%d %H:%M:%S")
            sql_complete_goal = get_query("completeGoal")
            with connection.cursor() as cursor:
                cursor.execute(sql_complete_goal, (data['email'], data['type'], data['target'], date_time_obj))
                if cursor.rowcount == 0:
                    raise UPDATE_FAILED
                
                connection.commit()
                return jsonify({"message": "Goal Completed Successfully"}), 200
        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code
                
        except UndefinedTable as e:
            error_message = "Error: Tables do not exist in the database. Reload The Page"
            setup_db()
            return jsonify({'error': error_message}), 500
            
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500

@app.route("/deleteGoal", methods=['DELETE'])
def deleteGoal():
    requiredFields = ['email', 'type', 'target', 'dateTime']

    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            verifyBody(data, requiredFields)

            date_time_obj = datetime.strptime(data['dateTime'], "%Y-%m-%d %H:%M:%S")
        
            sql_delete_goal = get_query("deleteGoal")
            with connection.cursor() as cursor:
                cursor.execute(sql_delete_goal, (data['email'], data['type'], data['target'], date_time_obj, False))
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


@app.route("/setGoal", methods=['POST'])
def setGoal():
    requiredFields = ['type', 'value', 'email']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            
            verifyBody(data, requiredFields)

            if float(data['value']) < 0:
                raise BAD_INPUT

            with connection.cursor() as cursor:
                sql_client = get_query("searchClientsByEmail")
                cursor.execute(sql_client, (data['email'],))
                if cursor.fetchone() is None:
                    raise EMAIL_NOT_FOUND

                sql_goal = get_query("addGoal")
                cursor.execute(sql_goal, (data['email'], data['type'], data['value']))

                connection.commit()
                return jsonify({"message": "Goal Set Successfully"}), 201
                
        except Error as e:
                return jsonify({'error': e.to_dict()}), e.code
                
        except UndefinedTable as e:
            error_message = "Error: Tables do not exist in the database. Reload The Page"
            setup_db()
            return jsonify({'error': error_message}), 500
        
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500


@app.route("/getAchievements", methods=['POST'])
def getAchievements():
    requiredFields = ['email']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            
            verifyBody(data, requiredFields)
            with connection.cursor() as cursor:
                sql_achievements = get_query("getAchievements")
                cursor.execute(sql_achievements, (data['email'],))
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

@app.route("/getGoals", methods=['POST'])
def getGoals():
    requiredFields = ['email', 'isCompleted']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            
            verifyBody(data, requiredFields)
            with connection.cursor() as cursor:
                sql_goals = get_query("searchClientsGoalByEmail")
                cursor.execute(sql_goals, (data['email'], data['isCompleted'],))
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
        

#######################################################################################################################


@app.route("/addSession", methods=['POST'])
def addSession():
    requiredFields = ['email', 'startTime', 'duration', 'sessionType', 'room']

    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            verifyBody(data, requiredFields)

            email = data['email'].lower()
            start_time = data['startTime']
            duration = data['duration']
            session_type = data['sessionType'].lower()
            roomNumber = int(data['room'])

            start_time_obj = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S")

            sql_find_email = get_query("searchTrainersByEmail")
            with connection.cursor() as cursor:
                cursor.execute(sql_find_email, (data['email'],))
                
                if cursor.fetchone() is None:
                    raise EMAIL_NOT_FOUND
                
                sql_check_session_availability = get_query("checkTrainerAvailability")
                cursor.execute(sql_check_session_availability, (email, start_time_obj, start_time_obj, duration))

                if not cursor.fetchone()[0]:
                    raise SESSION_UNAVAILABLE
                
                
                # Check if room is available
                sql_check_room_availbility = get_query("checkRoomAvailability")
                cursor.execute(sql_check_room_availbility, (roomNumber, start_time_obj, start_time_obj, duration))
                
                if not cursor.fetchone()[0]:
                    raise ROOM_UNAVAILABLE
            
                sql_add_session = get_query("addSession")
                cursor.execute(sql_add_session, (email, start_time_obj, duration, session_type, roomNumber,))
             

                connection.commit()
                return jsonify({'message': "Sucessfully Added Session"}), 201

        except Error as e:
            return jsonify({'error': e.to_dict()}), e.code
            
        except UndefinedTable as e:
            error_message = "Error: Tables do not exist in the database. Reload The Page"
            setup_db()
            return jsonify({'error': error_message}), 500
        
        except Exception as e:
            connection.rollback()
            return jsonify({"error": str(e)}), 500


@app.route("/getTrainerSessions", methods=['POST'])
def getTrainerSessions():
    requiredFields = ['email']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            verifyBody(data, requiredFields)
            sql_query = get_query("getAllTrainerSessions")
            with connection.cursor() as cursor:
                cursor.execute(sql_query, (data['email'],))
                
                if cursor.rowcount == 0:
                    raise EMAIL_NOT_FOUND
                
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


@app.route("/getAllSessions", methods=['POST'])
def getAllSessions():
    requiredFields =['email', 'type']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            verifyBody(data, requiredFields)

            with connection.cursor() as cursor:

                sql_query = get_query('getMemberID')
                cursor.execute(sql_query, (data['email'],))

                memberID = cursor.fetchone()[0]
                
                if memberID is None:
                    raise EMAIL_NOT_FOUND
                
                
                sql_query = get_query('getAllSessions')
                cursor.execute(sql_query, (data['type'], memberID,))

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

@app.route("/bookSession", methods=['POST'])
def bookTrainer():
    requiredFields = ['sessionID', 'email']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            verifyBody(data, requiredFields)

            with connection.cursor() as cursor:
                sql_query = get_query("getSessionID")
                cursor.execute(sql_query, (data['sessionID'],))
                sessionID = cursor.fetchone()[0]
                
                if sessionID is None:
                    raise SESSION_NOT_FOUND
                
                sql_query = get_query('getMemberID')
                cursor.execute(sql_query, (data['email'],))

                memberID = cursor.fetchone()[0]
                
                if memberID is None:
                    raise EMAIL_NOT_FOUND
                
                sql_query = get_query("bookSession")
                cursor.execute(sql_query, (sessionID, sessionID, memberID, sessionID, memberID,))
                if cursor.rowcount == 0:
                    raise SESSION_UNAVAILABLE
                
                return jsonify({'message': 'Session Booked Successfully'}), 201
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


@app.route("/getMemberType", methods=['POST'])
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



@app.route("/toggleEquipment", methods=['PUT'])
def toggle():
    requiredFilds = ['status', 'id']
    with psycopg2.connect(url) as connection:
        try:
            data = request.json
            verifyBody(data, requiredFilds)

            sql_query = get_query("toggleEquipment")
            with connection.cursor() as cursor:
                cursor.execute(sql_query, (data['status'], data['id'],))
                
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

@app.route("/getEquipment", methods=['GET'])
def getAllEquipment():
    return getAll("equipment")

# Get Clients By Name
@app.route("/searchClientsByName", methods=['POST'])
def searchClients():
    data = request.json
    return searchByName(data, "searchClientsByName")

@app.route("/searchTrainersByName", methods=['POST'])
def searchTrainers():
    data = request.json
    return searchByName(data, "searchTrainersByName")

# Get Members By Name
@app.route("/searchMembersByName", methods=['POST'])
def searchMembers():
    data = request.json
    return searchByName(data, "searchMembersByName")

@app.route("/getAllTrainers", methods=['GET'])
def getAllTrainers():
    return getAll("trainer")

# Get Clients Account Balance
@app.route("/getAllClientBalance", methods=['GET'])
def getAllClientBalance():
    return getAll("client-all-balance")

@app.route("/getClientBalanceByName", methods=['POST'])
def getClientBalance():
    data = request.json
    return searchByName(data, "getClientBalanceByName")

@app.route("/getAllRooms", methods=['GET'])
def getRooms():
    return getAll("rooms")

@app.route("/getClientBalanceByEmail", methods=['POST'])
def getClientBalanceByEmail():
    data = request.json
    required_fields = ['email']
    verifyBody(data, required_fields)

    with psycopg2.connect(url) as connection:
        try:
            sql_balance = get_query("getClientBalanceByEmail")
            with connection.cursor() as cursor:
                cursor.execute(sql_balance, (data['email'],))
                if cursor.rowcount == 0:
                    raise INVALID_EMAIL
            
                data = cursor.fetchone()
                
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



#######################################################################################################################

def getAll(userType:str):
    userType.lower()
    types  = {"member":"getAllMembers", "client":"getAllClients", "trainer":"getAllTrainers", "admin-staff":"getAllAdminStaff", 
              "client-all-balance":"getAllClientBalance", "rooms": "getAllRooms", "equipment":"getEquipment"}
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
                    cursor.execute(sql_query, (f'%{firstName}%', f'%{lastName}%',))
                else:
                    cursor.execute(sql_query, (f'%{fullName[0]}%', f'%{fullName[0]}%'))

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
   