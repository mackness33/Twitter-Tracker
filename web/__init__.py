#===============FLASK SERVER===============
from flask import Flask, redirect, url_for, send_file

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

import web.route


#==============INDEX====================
@app.route('/')
def routeIndex():
    return  redirect(url_for("auth.login")), 302

#==============ERROR HANDLING====================
# handle login failed
@app.errorhandler(401)
def page_not_found(e):
    return Response('<p>Login failed</p>')

@app.errorhandler(404)
def page_not_found(e):
    return send_file('errorHandler/404/404.html'), 404

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
