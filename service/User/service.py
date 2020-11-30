from ..core_model import Service
from database.models.odm_user_mongo import user
from .user import User
from flask import flash
from werkzeug.security import generate_password_hash, check_password_hash

class UsersService(Service):
    __model__ = user
    __return_class__ = User
    __collection__ = "user"

    def __init__(self):
        self._active_users = []


    def authentication(self, user, psw):
        usr = None
        try:
            usr = self.find_one(EMAIL = user)
        except Exception as e:
            flash('Wrong username or password')
            print('Wrong username or password')
            return None

        # if user doesn't exist or password is wrong, reload the page
        if usr is None:
            flash('Wrong username or password')
            print('{} not found'.format(user))
            return None

        # if the above check passes, then we know the user has the right credentials
        if not check_password_hash(usr["PASSWORD"], psw) or usr["PASSWORD"] == "":
            flash('Wrong username or password')
            print('Wrong password from {}'.format(user))
            return None

        return usr['SECOND_KEY']


    def add_user(self, user_id):
        _active_users.append(User(user_id, ""))

    def del_user(self, user):
        _active_users.remove(user)

    def print_users(self):
        for u in self._active_users:
            print("USERNAME: {}".format(u._id))
