from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, RadioField, IntegerField
from wtforms.validators import InputRequired, EqualTo, DataRequired, Length
from wtforms.widgets import html_params
from wtforms.fields.html5 import EmailField

class BaseForm(FlaskForm):
    pass
