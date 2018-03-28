# all the imports
import os
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
from mongoengine import *

#The next couple lines will create the actual application instance and initialize it with the config from the same file in flaskr.py:
	 
app = Flask(__name__) # create the application instance :)
app.config.from_object(__name__) # load config from this file , flaskr.py

# connect to the given database using Mongo
connect(
    'web3Data'
)

# class in mongo, start by defining the class then adding a 'Document' argument
# the argument is the database collection location of the document you are providing for output
class TestData(Document):
    email = StringField(required=True)
    first_name = StringField(max_length=50)
    last_name = StringField(max_length=50)

