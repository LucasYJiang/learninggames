# blueprint
import os
from flask import Flask,g
from pymongo import MongoClient
from flask_login import LoginManager
import config

from . import admin,files,common,workflow,application
#,databackup,  initialization,  sessions,syslogging, syssetting,

from .sessions import MongoSessionInterface

iinsapp = Flask(__name__)

iinsapp.register_blueprint(blueprint=admin.blueprint)
iinsapp.register_blueprint(blueprint=workflow.blueprint)
iinsapp.register_blueprint(blueprint=files.blueprint)
iinsapp.register_blueprint(blueprint=application.blueprint)
iinsapp.register_blueprint(blueprint=common.blueprint)

# Update configuration
common.DataInitialization().initialization()
iinsapp.config.from_object(config)
# configuration = admin.controller.ConfigurationService().getConfiguration()
# configuration['appConfig']['APPLICATION_ROOT'] = os.getcwd()
# configuration['appConfig']['SECRET_KEY'] = os.urandom(24)
# iinsapp.config.update(configuration["appConfig"])
# DATABASE_DOMAIN =configuration['database']['domain'] if configuration['database']['domain'] !=None else 'localhost'
# DATABASE_PORT =configuration['database']['port'] if configuration['database']['port'] !=None else 27017
DATABASE_DOMAIN = 'localhost'  # 52.34.181.89 localhost  192.168.254.3
DATABASE_PORT = 27017

# db = MongoClient(DATABASE_DOMAIN, DATABASE_PORT).db_mss
# user_login init
login_manager = LoginManager()
login_manager.init_app(iinsapp)

@login_manager.user_loader
def load_user(user):
    return admin.models.UserModel(user['_id'])
# session init
iinsapp.session_interface = MongoSessionInterface()

def instanceParams():
    # g.parameters = configuration['parameters']
    g.database=  MongoClient(DATABASE_DOMAIN, DATABASE_PORT)

iinsapp.before_request(instanceParams)





