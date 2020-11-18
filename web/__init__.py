#===============FLASK SERVER===============
from flask import Flask, redirect, url_for, send_file, Response
from twython import Twython

#==============OTHER PACKAGES==============
import os

#=================SERVICES=================
# from service.mongo_manager import db
# from service.jwt_manager import jwt_manager
# from service.Dash.app import DashApp

app = Flask(__name__, instance_relative_config=True, static_url_path="", static_folder="assets")


#===================AUTHENTICATION=========================
from .blueprints.auth.views import auth
app.register_blueprint(auth)


APP_KEY = '09kHJqtgk2AHxXZq2tyDyXsAU'
APP_SECRET = 'As1wcMtXaktX3iCADPRhKRsz9VwUBECZru6XCRKbGGs4LnUHun'

twitter = Twython(APP_KEY, APP_SECRET, oauth_version=2)
ACCESS_TOKEN = twitter.obtain_access_token()
twitter2 = Twython(APP_KEY, access_token=ACCESS_TOKEN)

#==============INDEX====================
@app.route('/')
def routeIndex():
    results = twitter.cursor(twitter2.search, q='python')
    i = 0
    for result in results:
        if i > 10:
            break
        else:
            print(result)
        i=i+1

    return results

#==============ERROR HANDLING====================
# handle login failed
@app.errorhandler(401)
def page_not_found(e):
    return Response('<p>Login failed</p>', 401)

@app.errorhandler(404)
def page_not_found(e):
    return send_file('errorHandler/404/404.html'), 404

app.config.update(
    DEBUG = True
    # UPLOAD_FOLDER = os.path.abspath(os.path.dirname(__file__))
    # MONGO_URI = "mongodb://127.0.0.1:27017"
    # SECURITY_PASSWORD_SALT = "dev"
    # SECRET_KEY = 'dev'
)

# try:
#     app.config.from_pyfile('config.py')
#     if app.config['ENV'] == 'deployment':
#         app.config.from_object('config.Deployment')
#     else:
#         app.config.from_object('config.Production')
# except OSError:
#     print ('Configuration file missing!')

# def create_app(test_config=None):
#     # create and configure the app
#     app = Flask(__name__, instance_relative_config=True, static_url_path="", static_folder="assets")
#
#     # ensure the instance folder exists + upload config
#     # try:
#     #     app.config.from_pyfile('config.py')
#     #     if app.config['ENV'] == 'deployment':
#     #         app.config.from_object('config.Deployment')
#     #     else:
#     #         app.config.from_object('config.Production')
#     # except OSError:
#     #     print ('Configuration file missing!')
#     #     return None
#
#     # init external modules
#     # db.init_app(app)
#     # jwt_manager.init_app(app)
#
#
#     # OPTIMIZE: Need to be optimize, ugly solution
#     # global dash_app
#     # dash_app = DashApp("dash_api", server=app, url_base_pathname='/dash/')
#
#     # within application context do
#     with app.app_context():
#
#         #===================AUTHENTICATION=========================
#         from .blueprints.auth.views import auth
#         app.register_blueprint(auth)
#
#         #===================APPLICATION=========================
#         from .blueprints.tweetthing.views import tweet
#         app.register_blueprint(tweet)
#
#         # TODO: add a blueprints for static docs and files
#         import web.route
#
#         #===================DASHBOARDS=========================
#         # import dashboard.B_warehouseDashboard
#
#
#     return app

# def dumb_app(test_config=None):
#     # create and configure the app
#     app = Flask(__name__, instance_relative_config=True, static_url_path="", static_folder="assets")
#
#     # ensure the instance folder exists + upload config
#     try:
#         app.config.from_pyfile('config.py')
#         app.config.from_object('config.Deployment')
#     except OSError:
#         print ('Configuration file missing!')
#         return None
#
#     # init external modules
#     # db.init_app(app)
#
#     # within application context do
#     with app.app_context():
#         pass
#
#     return app
