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
    say=request.form['ricerca']
    say2 = say[1:]
    # if say[0] == "#":
    #     return Twitter.cursor(Twitter.search, q=say2)
    if say[0] == '#':
        return T.tweets_lookup(id=1275828087666679809, fields={"tweet.fields": "author_id,created_at", "user.fields": "description,created_at"})
    elif say[0] == 'd':
        return T.tweets_lookup(id=[20,1276230436478386177,1276501058211262464], fields={"user.fields": "description,created_at"})
    elif say[0] == '@':
        return T.users_lookup(query=300, fields={"user.fields": "description,created_at"})
    elif say[0] == 'm':
        return T.users_lookup(query=[300,999578121123848192], fields={"user.fields": "description,created_at"})
    elif say[0] == 'u':
        return T.users_lookup(query='Twitter', fields={"user.fields": "description,created_at"})
    elif say[0] == 's':
        return T.users_lookup(query=['Twitter','TwitterDev','GiuseppeConteIT'], fields={"user.fields": "description,created_at"})
    elif say[0] == 'r':
        return T.recent_search(query=[say2], fields={"user.fields": "description,created_at", "tweet.fields": "author_id,created_at,entities,geo"})
        #return T.recent_search(query=['ciao', 'capitano'], fields={"user.fields": "description,created_at", "tweet.fields": "author_id,created_at,entities,geo"})
    elif say[0] == 'e':
        return T.sample_stream()
    elif say[0] == '$':
        return "not implemented"

    return "ERROR INPUT"

@tracker.route('/base')
def base():
    return  render_template('SWE_interfaccia.html')
