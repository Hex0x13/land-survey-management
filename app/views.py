from flask import render_template, request, redirect, session, url_for
from app import app
from app.models import User
import os

app.config['SECRET_KEY'] = os.urandom(24)

@app.route('/', methods=['GET'])
def dashboard():
    if session.get('id') and session.get('email') and session.get('surveyor_id'):
        return render_template('index.html')
    else:
        return redirect(url_for('login', error="You need to login first"))

@app.route('/login', methods=['GET'])
def login():
    if session.get('id') and session.get('email') and session.get('surveyor_id'):
        return redirect('/')
    error = request.args.get('error')
    return render_template('login.html', error=error)

@app.route('/login-authentication', methods=['POST'])
def loginAuth():
    try:
        email = request.form.get('email')
        password = request.form.get('password')
        user = User()
        result = user.select_user(email, password)
        if result:
            session['id'] = result[0]
            session['email'] = result[1]
            session['surveyor_id'] = result[2]
            return redirect('/')
        else:
            return redirect(url_for('login', error="Invalid email or password"))
    except Exception as error:
        return redirect(url_for('login', error="Invalid email or password"))

@app.route('/register', methods=['GET'])
def register():
    return render_template('sign-in.html')

@app.route('/register-process', methods=['POST'])
def register_process():
    try:
        email = request.form.get('email')
        password = request.form.get('password')
        user = User()
        result = user.select_user(email, password)
        return redirect('/login')
    except Exception as error:
        return redirect(url_for('register', error=str(error)))

@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect('/login')