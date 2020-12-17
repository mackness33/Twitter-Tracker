# import FLASK
from flask import Blueprint, render_template, redirect, url_for, request, after_this_request, jsonify
# import flask.ext
from flask_socketio import SocketIO, emit

# import TWHYTON
from twython import Twython

# import SERVICES
# TODO: need to find a way to import the ACCESS_TOKEN from the configuration
# import APP
from web import ACCESS_TOKEN, socketio
from service.Twitter.useful_class import Twitter
from service.Twitter.streamThread import StreamThread

# import OTHERS
import datetime
import json
from threading import Thread


#=============== DEFINITION ===============
tracker = Blueprint('tracker', __name__, template_folder='templates', static_folder='static')
T = Twitter(ACCESS_TOKEN)
# twitter = Twython(app.config['APP_KEY'], access_token=app.config['ACCESS_TOKEN'])
# T = Twitter(app.config['ACCESS_TOKEN'])



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
@socketio.on('my_event', namespace='/base')                          # Decorator to catch an event called "my event":
def test_message(message):                        # test_message() is the event callback function.
    print('In my event')
    emit('my response', {'data': 'got it!'})      # Trigger a new event called "my response"

@socketio.on('connect', namespace='/base')
def test_connect():
    # need visibility of the global thread object
    global thread
    thread = Thread()
    print('Client connected')
    #Start the random number generator thread only if the thread has not been started before.
    if not thread.isAlive():
        print("Starting Thread")
        thread = StreamThread()
        thread.start()


@socketio.on('disconnect', namespace='/base')
def disconnect_request():
    @copy_current_request_context
    def can_disconnect():
        disconnect()

    emit('my_response',
         {'data': 'Disconnected!', 'count': 10},
         callback=can_disconnect)

@tracker.route('/search2', methods = ['POST'])
def search_post():
    return T.get_tweets({"usernames": "TwitterDev,TwitterAPI", "user.fields": "description,created_at"})

@tracker.route('/base', methods = ['POST'])
# def base_post(in_json):
def base_post():
    say=request.form['ricerca']
    print(say)
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
        return T.recent_search(query=['ciao', 'capitano'], fields={"user.fields": "description,created_at", "tweet.fields": "author_id,created_at,entities,geo"})
    elif say[0] == 'e':
        return T.main()
    elif say[0] == '$':
        return "not implemented"

    return "ERROR INPUT"

@tracker.route('/base')
def base():
    return  render_template('SWE_interfaccia.html')
