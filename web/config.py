import os

class Config:
    # config upload file folder
    DEBUG = False
    UPLOAD_FOLDER = os.path.abspath(os.path.dirname(__file__))
    MONGO_URI = "mongodb://127.0.0.1:27017"
    SECURITY_PASSWORD_SALT = "dev"
    SECRET_KEY = 'dev'

class Production(Config):
    pass


class Deployment(Config):
    SECURITY_PASSWORD_SALT = "dev"
    SECRET_KEY = 'dev'

    DEBUG = True

    MONGO_URI = "mongodb://127.0.0.1:27017"
    URI_SERVER = "http://127.0.0.1:5000"
