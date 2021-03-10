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
        self._fields = ('tweet.fields=author_id,created_at,entities&'
            'expansions=geo.place_id,author_id,attachments.media_keys&'
            'place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type&'
            'user.fields=description,created_at,name,url&'
            'media.fields=url,preview_image_url'
        )
        self._processor = None
        self.stream = False

    #---------TWEETS LOOKUP----------
    def tweets_lookup(self, id, fields):
        url = self._create_url('tweets', 'ids', self._build_input(id)) + self._fields       # set up the url
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

        input = self._build_input(query)
        lu_type, field = by(input)
        url = self._create_url(lu_type, field, input) + self._fields                          # set up the url
        headers = self._create_headers()                         # set up the headers
        json_response = self._request_resources(url, headers)  # set up the response as a json
        return json_response

    #---------TIMELINE----------
    def timeline(self, username, fields):
        # TODO: test on the input, to ensure how its typo
        # TODO: multiple user order by tweet's date
        response = self.users_lookup(query=username, fields={"user.fields": "name"})
        url = self._base_url + "users/" + response["data"][0]["id"] + "/tweets?" + self._fields
        headers = self._create_headers()                         # set up the headers
        json_response = self._request_resources(url, headers)  # set up the response as a json
        return json_response

    #---------RECENT SEARCH----------
    def recent_search(self, query, fields):
        url = self._create_url('tweets/search/recent', 'query', self._build_input(query)) + self._fields  # set up the url
        headers = self._create_headers()                         # set up the headers
        json_response = self._request_resources(url, headers)  # set up the response as a json
        return json_response

    #---------STREAM---------
    def start_stream(self, input, types):
        self._end_stream.clear()
        print("types_start: ", types)
        self._processor = (self.filtred_stream(input, types) if (input is not None and input != "") else self.sample_stream())
        if self._processor != None and not self._processor.isAlive():
            print("Starting Thread")
            self._processor.start()
            self.stream = True

        print ('are we at the end?')

    def end_stream(self):
        self._end_stream.set()
        if self._processor is not None:
            self._processor.join()

    def get_rules(self, headers, bearer_token):
        response = requests.get(
            "https://api.twitter.com/2/tweets/search/stream/rules", headers=headers
        )
        if response.status_code != 200:
            raise Exception(
                "Cannot get rules (HTTP {}): {}".format(response.status_code, response.text)
            )
        print("GET: ", json.dumps(response.json()))
        return response.json()


    def delete_all_rules(self, headers, bearer_token, old_rules):
        if old_rules is None or "data" not in old_rules:
            return None

        ids = list(map(lambda rule: rule["id"], old_rules["data"]))
        payload = {"delete": {"ids": ids}}
        # payload = {"delete": {"ids": }}
        print("DEL payload: ", payload)
        response = requests.post(
            "https://api.twitter.com/2/tweets/search/stream/rules",
            headers=headers,
            json=payload
        )
        if response.status_code != 200:
            raise Exception(
                "Cannot delete rules (HTTP {}): {}\n\r{}".format(
                    response.status_code, response.text, print("DEL payload: ", payload)
                )
            )
        print("DELETED: ", json.dumps(response.json()))

    def delete_rules(self, headers, bearer_token, rules, old_rules):
        if (rules is None or "data" not in rules) or (old_rules is None or "data" not in old_rules):
            return

        value_to_add = list(map(lambda rule: rule["value"], rules))
        to_delete = list(filter(lambda role: role['value'] in value_to_add, old_rules["data"]))

        print("DEL in rules: ", rules)
        print("DEL in old_rules: ", old_rules)
        print("DEL in to_delete: ", to_delete)

        ids = list(map(lambda rule: rule["id"], to_delete))
        print("DEL ids: ", ids)
        if ids == []:
            return

        payload = {"delete": {"ids": ids}}
        print("DEL payload: ", payload)
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
        print("DELETED: ", json.dumps(response.json()))


    def set_rules(self, headers, delete, rules, bearer_token):
        # You can adjust the rules if needed
        print ("rules:", rules)
        # sample_rules = [
        # {"value": "dog has:images", "tag": "dog pictures"},
        # {"value": "cat has:images -grumpy", "tag": "cat pictures"},
        # ]
        # filt_rules = list()
        # filt_rules.append(rules)
        payload = {"add": rules}
        response = requests.post(
            "https://api.twitter.com/2/tweets/search/stream/rules",
            headers=headers,
            json=payload,
        )
        if response.status_code != 201:
            raise Exception(
                "Cannot add rules (HTTP {}): {}".format(response.status_code, response.text)
            )
        print("ADD: ", json.dumps(response.json()))


    # can use yield to send one tweet per time
    def get_stream(self, url, headers, bearer_token):
        response = requests.get(url, headers=headers, stream=True)

        print(response.status_code)
        if response.status_code != 200:
            print("exception on get stream")
            raise Exception(
                "Cannot get stream (HTTP {}): {}".format(
                    response.status_code, response.text
                )
            )

        print("url", url)
        print("headers", headers)

        for response_line in response.iter_lines():
            if self._end_stream.isSet():
                break

            if response_line:
                json_response = json.loads(response_line)
                socketio.emit('tweet', json_response, namespace='/base')
                time.sleep(5)
                # print(json.dumps(json_response, indent=4, sort_keys=True))

        print('END STREAM')
        self._end_stream.clear()
        # self.end_stream()


    #---------SAMPLE STREAM----------
    def sample_stream(self):
        print("Sample")
        bearer_token = self._bearer
        headers = self._create_headers()
        url = self._base_url + "tweets/sample/stream?" + self._fields
        return threading.Thread(target=self.get_stream, args=(url, headers, bearer_token))

    #---------FILTERED STREAM----------
    def filtred_stream(self, input, types):
        print("Filtred")
        bearer_token = self._bearer
        headers = self._create_headers()
        url = self._base_url + "tweets/search/stream?" + self._fields
        rules = self._build_rules(self._build_input(input), types)
        old_rules = self.get_rules(headers, bearer_token)
        delete = self.delete_all_rules(headers, bearer_token, old_rules)
        # delete = self.delete_all_rules(headers, bearer_token, rules, old_rules)
        set = self.set_rules(headers, delete, rules, bearer_token)
        return threading.Thread(target=self.get_stream, args=(url, headers, bearer_token))

    def _build_rules(self, input, types):
        def _set_value(input):
            val = "("
            for i in range(len(input)):
                val += " " + ("OR " if i > 0 else "")  + input[i]
            val += ")"

            return val

        def _get_val_and_tag(gen_rule, value, tag):
            rule = dict(gen_rule)
            print ("rule: ", rule)
            rule["value"] += value
            rule["tag"] += tag
            return rule

        print("input: ", input)
        print("types: ", types)
        if types == None or types == [] or types == ["keyword"]:
            rules = list()
            rules.append(_get_val_and_tag({"value":"", "tag": ""}, _set_value(input), "keywords"))
            rules[0] = _get_val_and_tag(rules[0], " lang:" + "it" + " -is:retweet", "")
            print ("rules", rules)
            return rules

        rules = list()
        # init rules
        for inp in input:
            rules.append({"value": "", "tag": inp})

        values = "("
        for word in range(len(input)):
            values += " " + ("OR " if word > 0 else "")  + input[word]
        values += ")"

        # add keyword rule
        if "keyword" in types:
            for word in range(len(rules)):
                print("rule: ", rules[word])
                rules[word] = _get_val_and_tag(rules[word], values, " keyword")

        # add username rule
        if "username" in types:
            for word in range(len(rules)):
                rules[word] = _get_val_and_tag(rules[word], " from:" + input[word], " username")

        for word in range(len(rules)):
            rules[word] = _get_val_and_tag(rules[word], " lang:" + "it" + " -is:retweet", "")

        print ("rules", rules)
        return rules

    def _build_input(self, input):
        input = input.split(',')
        index = 0
        for i in input:
            input[index] = i.strip()
            index += 1
        return input

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

    # CLEAR: USELESS
    # def _add_fields(self, url, fields):
    #     # Specify the usernames that you want to lookup below
    #     # You can enter up to 100 comma-separated values.
    #     # User fields are adjustable, options include:
    #     # created_at, description, entities, id, location, name,
    #     # pinned_tweet_id, profile_image_url, protected,
    #     # public_metrics, url, username, verified, and withheld
    #
    #     # key MUST be a parameter name
    #     # value is the value of the field
    #     for key in fields:
    #         url += key + "="                        # set the query key in the url
    #         if isinstance(fields[key], list):             # if the argument of the element is a list of value
    #             for val in fields[key]:
    #                 url += val + ','         # add multiple values
    #             url = url[:-1]                      # delete last character
    #         else:
    #             url += fields[key]
    #         url += "&"                              # add next one
    #
    #     url = url[:-1]                      # delete last character
    #
    #     print('url&fields: ', url)
    #     return url

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
