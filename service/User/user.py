from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin):
    def __init__(self, id, active=True, authenticated=True, confirmed=True):
        UserMixin.__init__(self)

        self._id = id
        self._active = active
        self._authenticated = authenticated
        self._confirmed = confirmed


    def get_id(self):
        """Return the email address to satisfy Flask-Login's requirements."""
        return self._id

    @property
    def is_authenticated(self):
        """Return True if the user is authenticated."""
        return self._authenticated

    @property
    def is_active(self):
        """Return True if the user is active."""
        return self._active

    @property
    def is_confirmed(self):
        """Return True if the user is authenticated."""
        return self._authenticated
