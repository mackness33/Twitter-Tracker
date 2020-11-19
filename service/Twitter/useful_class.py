from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
# from service.twitter_keys import ACCESS_TOKEN

import requests
import os
import json

class Twitter():
    def __init__(self, token):
        self._bearer = token

    def get_tweets(self, args):
        # bearer_token = ACCESS_TOKEN
        url = self.create_url(args)
        headers = self.create_headers()
        json_response = self.connect_to_endpoint(url, headers)
        return json_response


    # key = "name_of_the_field"
    # value = list(values)
    def create_url(self, args):
        # Specify the usernames that you want to lookup below
        # You can enter up to 100 comma-separated values.
        field = list()
        print (type(args))

        for key in args:
            field_string = key + "="
            print(field_string)
            if type(args[key]) is list:
                for val in args[key]:
                    field_string += val
            else:
                field_string += args[key]
            # print(key)
            field.append(field_string)
        # usernames = "usernames=TwitterDev,TwitterAPI"
        # user_fields = "user.fields=description,created_at"
        # User fields are adjustable, options include:
        # created_at, description, entities, id, location, name,
        # pinned_tweet_id, profile_image_url, protected,
        # public_metrics, url, username, verified, and withheld
        s = "field: "
        for i in range(len(field)):
            print("field: " + field[i])
            s += field[i]
        # print(s)
        url = "https://api.twitter.com/2/users/by?"
        for key in args:
            url += "{" + str(key) + "}&"
        url = url[:-1]
        print ("before: " + url)
        url.format(*field)
        print ("after: " + url)

        return url


    def create_headers(self):
        headers = {"Authorization": "Bearer {}".format(self._bearer)}
        return headers


    def connect_to_endpoint(self, url, headers):
        response = requests.request("GET", url, headers=headers)
        print(response.status_code)
        if response.status_code != 200:
            raise Exception(
                "Request returned an error: {} {}".format(
                    response.status_code, response.text
                )
            )
        return response.json()
