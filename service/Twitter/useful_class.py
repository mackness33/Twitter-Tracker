import requests
import os
import json

class Twitter():
    # token: bearer token for the authentication
    def __init__(self, token):
        self._bearer = token

    # get tweets based on the argument
    def get_tweets(self, args):
        url = self.create_url(args)                             # set up the url
        headers = self.create_headers()                         # set up the headers
        json_response = self.connect_to_endpoint(url, headers)  # set up the response as a json
        return json_response


    def create_url(self, args):
        # Specify the usernames that you want to lookup below
        # You can enter up to 100 comma-separated values.
        # User fields are adjustable, options include:
        # created_at, description, entities, id, location, name,
        # pinned_tweet_id, profile_image_url, protected,
        # public_metrics, url, username, verified, and withheld

        url = "https://api.twitter.com/2/users/by?"

        # key MUST be a parameter name
        # value is the value of the field
        for key in args:
            url += key + "="                        # set the query key in the url
            if type(args[key]) is list:             # if the argument of the element is a list of value
                for val in args[key]:
                    url += '"' + val + '",'         # add multiple values
                url = url[:-1]                      # delete last character
            else:
                url += args[key]
            url += "&"                              # add next one

        url = url[:-1]                      # delete last character

        return url

    # create headers
    def create_headers(self):
        # adding the authentication token for twitter (OATH2)
        headers = {"Authorization": "Bearer {}".format(self._bearer)}
        return headers


    # create the response
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
