import requests
import os
import json
import threading
import time
from web import socketio

# from .stream_thread import StreamThread


# TODO: if incorrect type of input raise an exception.
# TODO: exception handling.
# TODO: testing.

class TwitterService():
    # token: bearer token for the authentication
    def __init__(self, token):
        self._bearer = token
        self._base_url = "https://api.twitter.com/2/"
        self._end_stream = threading.Event()

    #---------TWEETS LOOKUP----------
    def tweets_lookup(self, id, fields):
        url = self._create_url('tweets', 'ids', id)                          # set up the url
        url = self._add_fields(url, fields)                          # set up the url
        headers = self._create_headers()                         # set up the headers
        json_response = self._request_resources(url, headers)  # set up the response as a json
        return json_response


    #---------USERS LOOKUP----------
    def users_lookup(self, query, fields):
        def by(query):
            if isinstance(query, list):
                if isinstance(query[0], int):
                    return 'users', 'ids'
                else:
                    return 'users/by', 'usernames'
            else:
                if isinstance(query, int):
                    return 'users', 'ids'
                else:
                    return 'users/by/username', 'usernames'

        lu_type, field = by(query)
        url = self._create_url(lu_type, field, query)                          # set up the url
        url = self._add_fields(url, fields)                          # set up the url
        headers = self._create_headers()                         # set up the headers
        json_response = self._request_resources(url, headers)  # set up the response as a json
        return json_response


    #---------RECENT SEARCH----------
    def recent_search(self, query, fields):

        url = self._create_url('tweets/search/recent', 'query', query if isinstance(query, list) else list(query))  # set up the url
        url = self._add_fields(url, fields)                          # set up the url
        headers = self._create_headers()                         # set up the headers
        json_response = self._request_resources(url, headers)  # set up the response as a json
        return json_response

    #---------SAMPLE STREAM----------
    def sample_stream(self):
        url = self._base_url + 'tweets/sample/stream'           # set up the url
        headers = self._create_headers()                         # set up the headers
        json_response = self._request_resources(url, headers)  # set up the response as a json
        return json_response

    def end_stream(self):
        self._end_stream.clear()

    def get_rules(self, headers, bearer_token):
        response = requests.get(
            "https://api.twitter.com/2/tweets/search/stream/rules", headers=headers
        )
        if response.status_code != 200:
            raise Exception(
                "Cannot get rules (HTTP {}): {}".format(response.status_code, response.text)
            )
        print(json.dumps(response.json()))
        return response.json()


    def delete_all_rules(self, headers, bearer_token, rules):
        if rules is None or "data" not in rules:
            return None

        ids = list(map(lambda rule: rule["id"], rules["data"]))
        payload = {"delete": {"ids": ids}}
        response = requests.post(
            "https://api.twitter.com/2/tweets/search/stream/rules",
            headers=headers,
            json=payload
        )
        if response.status_code != 200:
            raise Exception(
                "Cannot delete rules (HTTP {}): {}".format(
                    response.status_code, response.text
                )
            )
        print(json.dumps(response.json()))


    def set_rules(self, headers, delete, bearer_token):
        # You can adjust the rules if needed
        sample_rules = [
            {"value": "dog has:images", "tag": "dog pictures"},
            {"value": "cat has:images -grumpy", "tag": "cat pictures"},
        ]
        payload = {"add": sample_rules}
        response = requests.post(
            "https://api.twitter.com/2/tweets/search/stream/rules",
            headers=headers,
            json=payload,
        )
        if response.status_code != 201:
            raise Exception(
                "Cannot add rules (HTTP {}): {}".format(response.status_code, response.text)
            )
        print(json.dumps(response.json()))


    # can use yield to send one tweet per time
    def get_stream(self, headers, set, bearer_token):
        response = requests.get(
            # "https://api.twitter.com/2/tweets/search/stream", headers=headers, stream=True,
            "https://api.twitter.com/2/tweets/sample/stream?tweet.fields=entities,geo,author_id", headers=headers, stream=True,
        )
        print(response.status_code)
        if response.status_code != 200:
            raise Exception(
                "Cannot get stream (HTTP {}): {}".format(
                    response.status_code, response.text
                )
            )
        for response_line in response.iter_lines():
            if self._end_stream.isSet():
                break

            if response_line:
                json_response = json.loads(response_line)
                socketio.emit('tweet', json_response, namespace='/base')
                time.sleep(5)
                # print(json.dumps(json_response, indent=4, sort_keys=True))

        self.end_stream()

    def main(self):
        bearer_token = self._bearer
        headers = self._create_headers()
        # rules = self.get_rules(headers, bearer_token)
        # delete = self.delete_all_rules(headers, bearer_token, rules)
        # set = self.set_rules(headers, delete, bearer_token)
        thread = threading.Thread(target=self.get_stream, args=(headers, set, bearer_token))
        if not thread.isAlive():
            print("Starting Thread")
            thread.start()

        print ('are we at the end?')

    # TODO: build input by divide input by "," and then trim it
    def _build_input(self, input):
        return True

    def _create_url(self, type, field, values):
        # Specify the usernames that you want to lookup below
        # You can enter up to 100 comma-separated values.
        # User fields are adjustable, options include:
        # created_at, description, entities, id, location, name,
        # pinned_tweet_id, profile_image_url, protected,
        # public_metrics, url, username, verified, and withheld

        # add the type of request
        url = self._base_url + type

        # multiple arguments or single arg
        if not isinstance(values, list):
            url += '/' + str(values) + '?'
        else:
            # key MUST be a parameter name
            # value is the value of the field
            url += '?' + field + '='
            for value in values:                # for each value
                print ('value: ', value)
                url += str(value) + ','              # add value

            url = url[:-1] + '&'                     # delete last character

        print('url: ', url)
        return url

    def _add_fields(self, url, fields):
        # Specify the usernames that you want to lookup below
        # You can enter up to 100 comma-separated values.
        # User fields are adjustable, options include:
        # created_at, description, entities, id, location, name,
        # pinned_tweet_id, profile_image_url, protected,
        # public_metrics, url, username, verified, and withheld

        # key MUST be a parameter name
        # value is the value of the field
        for key in fields:
            url += key + "="                        # set the query key in the url
            if isinstance(fields[key], list):             # if the argument of the element is a list of value
                for val in fields[key]:
                    url += val + ','         # add multiple values
                url = url[:-1]                      # delete last character
            else:
                url += fields[key]
            url += "&"                              # add next one

        url = url[:-1]                      # delete last character

        print('url&fields: ', url)
        return url

    # create headers
    def _create_headers(self):
        # adding the authentication token for twitter (OATH2)
        headers = {"Authorization": "Bearer {}".format(self._bearer)}
        return headers


    # create the response
    def _request_resources(self, url, headers):
        response = requests.request("GET", url, headers=headers)
        print(response.status_code)
        if response.status_code != 200:
            raise Exception(
                "Request returned an error: {} {}".format(
                    response.status_code, response.text
                )
            )
        return response.json()
