from flask import Flask, request, render_template, jsonify
from security import hash_password, verify_password
from custom_errors import *





app = Flask(__name__)

@app.route("/test")
def index():
    return {"object":["1", "2", "3"]}


@app.route("/addMember", methods=['POST'])
def addMember():
    registerFields = ['first_name', 'last_name', 'email', 'password', 'date_of_birth', 'gender', 'account_type']
    try:
        data = request.json
        if any(field not in data for field in registerFields):
            return jsonify({"error": MISSING_ENTRY}), 400

        hashed_pswd = hash_password(data['password'])
        
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


