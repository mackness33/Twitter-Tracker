# from web import app, db, auth
from flask import Flask, Response, redirect, url_for, request, session, abort, send_file, send_from_directory, current_app
from flask_login import LoginManager, UserMixin, login_required, login_user, logout_user
import os
# from web.services import db
# from web.email.token import confirm_token



#==============INDEX====================
# @current_app.route('/')
# def routeIndex():
#     return  redirect("/login"), 302



#==============ERROR HANDLING====================
# # handle login failed
# @current_app.errorhandler(401)
# def page_not_found(e):
#     return Response('<p>Login failed</p>')
#
# @current_app.errorhandler(404)
# def page_not_found(e):
#     return send_file('errorHandler/404/404.html'), 404
#
# #==============STATIC FILES routing ====================
# @current_app.route('/favicon.ico')
# def favicon():
#     return send_from_directory(os.path.join(current_app.root_path, 'assets/img/'), 'favicon.ico')
#
# @current_app.route('/doc/Privacy')
# def download_privacyDataPDF():
#     return send_file('assets/pdf/GDPR_ZENON.pdf',attachment_filename='ZENON_privacy.pdf',as_attachment=True)
#
# @current_app.route('/doc/IndustrialData')
# def download_industrialDataPDF():
#     return send_file('assets/pdf/PI_ZENON.pdf',attachment_filename='ZENON_data.pdf',as_attachment=True)
