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
    print('connecting socket ..')
    emit('connection_done')

@socketio.on('start_sample', namespace='/base')
def start_sample(msg):
    print(msg)
    T.main()

@socketio.on('stop_stream', namespace='/base')
def the_end(msg):
    print(message)
    T.end_stream()

@socketio.on('disconnect_server', namespace='/base')
def disconnect_request():
    T.end_stream()
    print('disconnecting socket ..')
    emit('disconnect_client', {'data': 'disconnecting socket ...'})

@tracker.route('/base', methods = ['POST'])
def base_post():
    data = request.form['ricerca']
    print('data: ', data)
    if data != "":
        search_type = data[0]
        data = data[1:]
    else:
        return json.dumps('Error on input')

    # fields = request.form['fields']
    # print('message: ', msg)

    if search_type == '#':
        return T.tweets_lookup(id=data, fields={"user.fields": "description,created_at", "tweet.fields": "author_id,created_at,entities,geo"})
    elif search_type == '@':
        return T.users_lookup(query=data, fields={"user.fields": "description,created_at"})
    elif search_type == '$':
        
        return T.recent_search(query=data, fields={"user.fields": "description,created_at", "tweet.fields": "author_id,created_at,entities,geo"})

    return {"text": 'Error on input', "data": 'ERROR', "status_code": 413}

@tracker.route('/base')
def base():
    return  render_template('SWE_interfaccia.html')
