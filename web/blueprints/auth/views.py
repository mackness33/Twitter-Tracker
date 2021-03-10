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


#---------------SOCKETIO---------------
@socketio.on('connection', namespace='/base')
def socket_connection():
    print('connecting socket ..')
    emit('connection_done')

@socketio.on('start_stream', namespace='/base')
def start_stream(data):
    T.end_stream()
    print("Data: ", data)
    T.start_stream(data["input"], data["type"])

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
    try:
        data = request.form['ricerca_chiave']
        data_user = request.form['ricerca_nome']
        try:
            persona = request.form['persona']
            print(persona)
        except:
            persona = False
        try:
            parola_chiave = request.form['parola_chiave']
            print(parola_chiave)
        except:
            parola_chiave = False

        print('data: ', data)
        if ((data == "") and (parola_chiave != False)) or ((data_user == "") and (persona != False)):
            return json.dumps('Error on input')

        if parola_chiave:
            return T.recent_search(query=data, fields={"tweet.fields": "author_id,created_at,entities", "expansions": "geo.place_id,author_id,attachments.media_keys", "place.fields": "contained_within,country,country_code,full_name,geo,id,name,place_type", "user.fields": "description,created_at,name,url", "media.fields": "url,preview_image_url"})
        elif persona:
            return T.recent_search(query="from:"+data_user, fields={"tweet.fields": "author_id,created_at,entities", "expansions": "geo.place_id,author_id", "place.fields": "contained_within,country,country_code,full_name,geo,id,name,place_type", "user.fields": "description,created_at,name,url"})
            #return T.timeline(username=data_user, fields={"tweet.fields": "author_id,created_at,entities", "expansions": "geo.place_id,author_id", "place.fields": "contained_within,country,country_code,full_name,geo,id,name,place_type", "user.fields": "description,created_at,name,url"})
    except:
        print ("No data found")

    return json.dumps('Seleziona un filtro')

@tracker.route('/base')
def base():
    return  render_template('SWE_interfaccia.html')
