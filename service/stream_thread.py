from flask_socketio import SocketIO, emit
from web import socketio
from threading import Thread, Event
from time import sleep
from random import random
import requests

thread = Thread()
thread_stop_event = Event()

class StreamThread(Thread):
    def __init__(self, headers, set, bearer_token):
        self.delay = 1
        super(StreamThread, self).__init__()
        self._headers = headers
        self._set = set
        self._bearer = bearer_token

    def randomNumberGenerator(self):
        """
        Generate a random number every 1 second and emit to a socketio instance (broadcast)
        Ideally to be run in a separate thread?
        """
        #infinite loop of magical random numbers
        print("Making random numbers")
        while not thread_stop_event.isSet():
            number = round(random()*10, 3)
            print (number)
            socketio.emit('newnumber', {'number': number}, namespace='/test')
            sleep(self.delay)

    def get_stream(self, headers, set, bearer_token):
        response = requests.get(
            "https://api.twitter.com/2/tweets/search/stream", headers=self._headers, stream=True,
        )
        print(response.status_code)
        if response.status_code != 200:
            raise Exception(
                "Cannot get stream (HTTP {}): {}".format(
                    response.status_code, response.text
                )
            )
        for response_line in response.iter_lines():
            if response_line:
                json_response = json.loads(response_line)
                socketio.emit('stream', {'tweet': json_response}, namespace='/test')
                # print(json.dumps(json_response, indent=4, sort_keys=True))

    def run(self):
        self.get_stream()
