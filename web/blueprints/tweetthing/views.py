# import FLASK
from flask import Blueprint, render_template, redirect, url_for, request, jsonify, Response, send_file, current_app
# from flask_jwt_extended import jwt_required, jwt_refresh_token_required, current_user

# import OTHERS
import time
import datetime



# this blueprint manages all the route for the zendash application:
tweet = Blueprint('tweet', __name__, template_folder='templates', static_folder='/blueprints/static')

#---------- BASE -------------
@tweet.route('/base')
def base():
    print('=================')
    print('IN BASE')
    print('request_cookie: {}'.format(request.cookies))
    # print('current_user: {}'.format(current_user))
    print('=================')

    return render_template('base.html')
