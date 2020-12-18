# import FLASK
from flask import Blueprint, render_template, redirect, url_for, request, after_this_request, jsonify, copy_current_request_context
# import flask.ext
from flask_socketio import SocketIO, emit

# import TWHYTON
from twython import Twython

# import SERVICES
# TODO: need to find a way to import the ACCESS_TOKEN from the configuration
# import APP
from web import ACCESS_TOKEN, socketio
from service.twitter_service import TwitterService
# from service.stream_thread import StreamThread

# import OTHERS
from threading import Thread
import datetime
import json


#=============== DEFINITION ===============
tracker = Blueprint('tracker', __name__, template_folder='templates', static_folder='static')
T = TwitterService(ACCESS_TOKEN)
# T = Twitter(app.config['ACCESS_TOKEN'])



#---------------SOCKETIO---------------
@socketio.on('connect', namespace='/base')
def socket_connection():
    print('Client is connected')

@socketio.on('start_sample', namespace='/base')
def socket_connection():
    print(msg)
    T.main()

@socketio.on('stop_stream', namespace='/base')                          # Decorator to catch an event called "my event":
def the_end(message):                        # test_message() is the event callback function.
    print('In the_end')
    T.end_stream()
    print(message)

@socketio.on('disconnect', namespace='/base')
def disconnect_request():
    @copy_current_request_context
    def can_disconnect():
        disconnect()

    print('disconnecting socket ..')
    emit('disconnect', {'data': 'disconnecting socket ...'}, callback=can_disconnect)

@tracker.route('/base', methods = ['POST'])
# def base_post(in_json):
def base_post():
    say=request.form['ricerca']
    print('say: ', say)
    # print('message: ', msg)
    # say2 = say[1:]
    # if say[0] == "#":
    #     return Twitter.cursor(Twitter.search, q=say2)
    # if say[0] == '#':
    #     return T.tweets_lookup(id=1275828087666679809, fields={"tweet.fields": "author_id,created_at", "user.fields": "description,created_at"})
    # elif say[0] == 'd':
    #     return T.tweets_lookup(id=[20,1276230436478386177,1276501058211262464], fields={"user.fields": "description,created_at"})
    # elif say[0] == '@':
    #     return T.users_lookup(query=300, fields={"user.fields": "description,created_at"})
    # elif say[0] == 'm':
    #     return T.users_lookup(query=[300,999578121123848192], fields={"user.fields": "description,created_at"})
    # elif say[0] == 'u':
    #     return T.users_lookup(query='Twitter', fields={"user.fields": "description,created_at"})
    # elif say[0] == 's':
    #     return T.users_lookup(query=['Twitter','TwitterDev','GiuseppeConteIT'], fields={"user.fields": "description,created_at"})
    # elif say[0] == 'r':
    #     return T.recent_search(query=['ciao', 'capitano'], fields={"user.fields": "description,created_at", "tweet.fields": "author_id,created_at,entities,geo"})
    # elif say[0] == 'e':
    #     return 'T.main()'
    # elif say[0] == '$':
    #     return "not implemented"

    return "ERROR INPUT"

@tracker.route('/base')
def base():
    return  render_template('SWE_interfaccia.html')
