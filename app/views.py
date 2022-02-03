from flask import render_template
from app import app

@app.route('/')
def home():
    return "There was a change!"

@app.route('/template')
def template():
    return render_template('home.html')