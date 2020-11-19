# import FLASK
from flask import Blueprint, render_template, redirect, url_for, request, after_this_request, jsonify
# from flask_jwt_extended import (
#     JWTManager, jwt_required, create_access_token, jwt_refresh_token_required, create_refresh_token, set_access_cookies,
#     set_refresh_cookies, unset_jwt_cookies, unset_access_cookies, current_user
# )

# import FLASK security
from werkzeug.security import generate_password_hash, check_password_hash

# import TWHYTON
from twython import Twython

# import SERVICES
# from service.twitter_keys import ACCESS_TOKEN, APP_KEY
from service.Twitter.useful_class import Twitter

# TODO: need to find a way to import the ACCESS_TOKEN from the configuration
# import APP
from web import ACCESS_TOKEN

# import OTHERS
import datetime
import json


#=============== DEFINITION ===============
tracker = Blueprint('tracker', __name__, template_folder='templates', static_folder='static')

# twitter = Twython(app.config['APP_KEY'], access_token=app.config['ACCESS_TOKEN'])

# T = Twitter(app.config['ACCESS_TOKEN'])
T = Twitter(ACCESS_TOKEN)

#---------------LOGIN---------------
# @tracker.route('/search')
# def search():
#     lis = {}
#     try :
#         results = twitter.cursor(twitter.search, q='bombardino')
#         i = 0
#         for result in results:
#             if i < 10:
#                 lis[i] = result
#             i=i+1
#     except:
#         print(lis)
#
#     return lis

@tracker.route('/search2', methods = ['POST'])
def search_post():
    return T.get_tweets({"usernames": "TwitterDev,TwitterAPI", "user.fields": "description,created_at"})

@tracker.route('/base', methods = ['POST'])
# def base_post(in_json):
def base_post():
    return in_json

@tracker.route('/base')
def base():
    return  render_template('SWE_interfaccia.html')


# @auth.route('/login', methods=['POST'])
# def login_post():
#     form = LoginForm(request.form)
#     print('{} tried to log in'.format(form.email.data))
#
#     # check if form is valid
#     if(form.validate_on_submit()):
#         # validating the data of the form
#         id = form.email.data
#
#         if id is not None:
#             print('id = {}'.format(id))
#             date_end =  datetime.timedelta(seconds=360000000)
#
#             # create an access_token token that exists for 5 min
#             # access_token = create_access_token(identity=id, expires_delta=date_end)
#             # # create an access_token token
#             # refresh_token = create_refresh_token(identity=id)
#
#             # adding the token to the response
#             # TODO: try a more elegant or useful way to do it
#             # @after_this_request
#             # def adding(response):
#             #     set_access_cookies(response, access_token)
#             #     set_refresh_cookies(response, refresh_token)
#             #     return response
#
#             print('Loggin {}'.format(form.email.data))
#             return redirect(url_for('tweet.base'))
#
#             print('{} has been refiused'.format(form.email.data))
#         return redirect(url_for('auth.login'))
#     else:
#         # TODO: handle it       -> it needs logs
#         errors = form.errors
#
#     print('errors: {}'.format(errors))
#     print('{} has been refused'.format(form.email.data))
#     return jsonify(errors)
#     # print('No good for my dude {}'.format(form.email.data))
#     # return render_template('login.html', form=form)


#---------------SIGNUP---------------
@tracker.route('/signup')
def signup():
    return render_template('signup.html')


# @auth.route('/signup', methods=['POST'])
# def signup_post():
#     form = SignupForm(request.form)
#     print('{} tried to signup'.format(form.email.data))
#
#     # setting next
#     # TODO: setting next. Need to redirect to the right function that return that uri
#     # if request.args.get('next'):
#     #     next = render_template(request.args.get('next'), form=ErrorForm())
#     # next = url_for('auth.signup')
#
#     if(form.validate_on_submit()):
#         # pwd has be added to the try so that if some errors are catched the hash won't be rememberd/recorded
#         # if users.count(EMAIL=form.email.data) == 0:
#             # try:
#                 # pwd = generate_password_hash(form.password.data.strip(), method='sha512')
#                 # users.insert_one(
#                 #     EMAIL=form.email.data, PASSWORD=pwd, TYPE=form.type.data, NAME=form.name.data, SURNAME=form.surname.data, BIRTHDAY=form.birthday.data,
#                 #     GENDER=form.gender.data, FISCAL_CODE=form.fiscal_code.data, COMPANY_NAME=form.company_name.data, ENTERPRISE=form.enterprise.data,
#                 #     VAT_NUM=form.vat.data, COUNTRY=form.country.data,PROVINCE=form.province.data, ZIPCODE=form.zipcode.data, ADDRESS=form.address.data,
#                 #     SIGNUP= signupUser(TOKEN_SIGNUP = 'Nothing for now', CONFIRMED=False), ACTIVE= False, PROJECTS = project(PROJECT=["DIMOSTRATIVO2"]),
#                 #     SECOND_KEY = form.email.data+"_is_secret =)"
#                 # )
#
#         print('{} successfully sign up'.format(form.email.data))
#         return url_for('auth.login'), 200
#         #     except Exception as e:
#         #         print(e)
#         #         print('sorry for {}, got problem with the database'.format(form.email.data))
#         #         errors = {'name': form.email.data, 'value': 'Invalid email address'}
#         # else:
#         #     print('{} already exists'.format(form.email.data))
#         #     errors = {'name': form.email.data, 'value': 'Email already exists'}
#     else:
#         errors = form.errors
#
#     print('errors: {}'.format(errors))
#     print('No good for my dude {}'.format(form.email.data))
#     return jsonify(errors)

#---------------LOGOUT---------------
@tracker.route('/logout')
# @jwt_required
def logout():
    #TODO: add index
    # @after_this_request
    # def adding(response):
    #     unset_jwt_cookies(response)
    #     return response

    return redirect(url_for('tracker.login'))
