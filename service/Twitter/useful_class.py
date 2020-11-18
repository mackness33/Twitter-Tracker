from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from service.twitter_keys import ACCESS_TOKEN

import requests
import os
import json

class Twitter():
    def main(self):
        bearer_token = ACCESS_TOKEN
        url = self.create_url()
        headers = self.create_headers(bearer_token)
        json_response = self.connect_to_endpoint(url, headers)
        return json_response


    def create_url(self):
        # Specify the usernames that you want to lookup below
        # You can enter up to 100 comma-separated values.
        usernames = "usernames=TwitterDev,TwitterAPI"
        user_fields = "user.fields=description,created_at"
        # User fields are adjustable, options include:
        # created_at, description, entities, id, location, name,
        # pinned_tweet_id, profile_image_url, protected,
        # public_metrics, url, username, verified, and withheld
        url = "https://api.twitter.com/2/users/by?{}&{}".format(usernames, user_fields)
        return url


    def create_headers(self, bearer_token):
        headers = {"Authorization": "Bearer {}".format(bearer_token)}
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
