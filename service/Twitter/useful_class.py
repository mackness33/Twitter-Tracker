import requests
import os
import json

# TODO: if incorrect type of input raise an exception.
# TODO: if in multiple args one doesn't exist retry starting from the next one.

class Twitter():
    # token: bearer token for the authentication
    def __init__(self, token):
        self._bearer = token
        self._base_url = "https://api.twitter.com/2/"

    #---------TWEETS LOOKUP----------
    def tweets_lookup(self, id, **fields):
        url = self._create_url('tweets', 'ids', id)                          # set up the url
        headers = self._create_headers()                         # set up the headers
        json_response = self._request_resources(url, headers)  # set up the response as a json
        return json_response

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
        if not isinstance(values, list) or len(values) == 1:
            url += '/' + str(values)
        else:
            # key MUST be a parameter name
            # value is the value of the field
            url += '?' + field + '='
            for value in values:                # for each value
                print ('value: ', value)
                url += str(value) + ','              # add value

            url = url[:-1]                      # delete last character

        print('url: ', url)
        return url

    def _add_fields(self, url, **fields):
        # Specify the usernames that you want to lookup below
        # You can enter up to 100 comma-separated values.
        # User fields are adjustable, options include:
        # created_at, description, entities, id, location, name,
        # pinned_tweet_id, profile_image_url, protected,
        # public_metrics, url, username, verified, and withheld
        url = self._base_url + url

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
