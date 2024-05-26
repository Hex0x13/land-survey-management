from flask import Flask
from config import Config


app = Flask(__name__)
app.config.from_object(Config)

from app import surveyor_routes
from app import client_routes
from app import project_routes
from app import views
