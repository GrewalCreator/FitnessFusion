from flask import Flask

app = Flask(__name__)

@app.route("/test")
def index():
    return {"object":["1", "2", "3"]}