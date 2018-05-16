# all the imports
import os
import csv
import json
import sqlite3
import logging
from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash, jsonify
from mongoengine import *

#The next couple lines will create the actual application instance and initialize it with the config from the same file in flaskr.py:
	 
app = Flask(__name__) # create the application instance :)
app.config.from_object(__name__) # load config from this file , flaskr.py

# connect to the given database using Mongo
connect('patrick')

class User(Document):
	username = StringField(max_length=50)
	password = StringField(max_length=50)

class MaleriaCases(Document):
	country = StringField(max_length=50)
	data = DictField()
	#year = StringField(max_length=50)
	#unemploymentPercent = StringField(max_length=50)
	

def create_data():
	with open('data/reported_maleria_cases.csv') as File:
		reader = csv.DictReader(File, delimiter=',')
							
		for line in reader:
			tempCountry = line["country"]
			countryData = {}
			for i in range(1989,2007):
				year = str(i)
				reported_cases = line[year]
				countryData[year] = reported_cases
				
			MaleriaCases(country=tempCountry,data=countryData).save()
	return "Success"


newUser = User(username='test', password='test').save()
	
# Load default config and override config from an environment variable
app.config.update(dict(
	DATABASE=os.path.join(app.root_path, 'flaskr.db'),
	SECRET_KEY='development key',
	USERNAME='admin',
	PASSWORD='default'
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)

@app.route('/')
def show_entries():
# changed to index.html for the bootstrap page 
	return render_template('index.html')
	
@app.route('/display')
def displayRoute():
	data = MaleriaCases.objects
	return data.to_json()

@app.route('/data')
def data():
	create_data()
	return render_template('index.html')

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