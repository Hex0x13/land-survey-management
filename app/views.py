from flask import render_template
from app import app

@app.route('/sign-in', methods=['GET'])
def sign_in():
  return render_template('sign-in.html')

@app.route('/login', methods=['GET'])
def login():
  return render_template('login.html')

@app.route('/', methods=['GET'])
def dashboard():
  return render_template('index.html')
