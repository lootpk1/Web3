# all the imports
import os
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
from mongoengine import *

#The next couple lines will create the actual application instance and initialize it with the config from the same file in flaskr.py:
	 
app = Flask(__name__) # create the application instance :)
app.config.from_object(__name__) # load config from this file , flaskr.py

# connect to the given database using Mongo
connect('patrick')

class User(Document):
    username = StringField(max_length=50)
    password = StringField(max_length=50)

newUser = User(username='test', password='test').save()

# Load default config and override config from an environment variable

app.config.from_envvar('FLASKR_SETTINGS', silent=True)

@app.route('/')
def show_entries():
    return render_template('show_entries.html', dataList = dataList)
   
@app.route('/add', methods=['POST'])
def add_entry():
    if not session.get('logged_in'):
        abort(401)
    flash('New entry was successfully posted')
    return redirect(url_for('show_entries'))
   
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] != newUser.username:
            error = 'Invalid username'
        elif request.form['password'] != newUser.password:
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            flash('You were logged in')
            return redirect(url_for('show_entries'))
    return render_template('login.html', error=error)
   
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('show_entries'))