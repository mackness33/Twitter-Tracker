from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, RadioField, IntegerField, SelectField
from wtforms.validators import InputRequired, EqualTo, DataRequired, Length, Required
from wtforms.widgets import html_params
from wtforms.fields.html5 import EmailField

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[InputRequired(message='Email not inserted')])
    password = PasswordField('Password', validators=[InputRequired(message='Password not inserted')])



#TODO: Add checks to each field
#TODO: Add country etc.. as grouplist
class SignupForm(FlaskForm):
    email = EmailField('Email',validators=[InputRequired()])
    password = PasswordField('Password', validators=[EqualTo('repeated_password'), InputRequired(), Length(min=6,max=25)])
    repeated_password = PasswordField('Password',validators=[EqualTo('password'), InputRequired(), Length(min=6,max=25)])
    birthday = StringField('Birthday',validators=[InputRequired()])
    gender = SelectField('Gender', choices = [('male', 'Male'), ('female', 'Female')], validators = [Required()])
    type = RadioField('Type', choices=[('company', 'Company'), ('freelance', 'Freelance')])
    name = StringField('Name',validators=[InputRequired()])
    surname = StringField('Surname',validators=[InputRequired()])
    fiscal_code = StringField('Fiscal Code',validators=[InputRequired()])
    company_name = StringField('Company Name',validators=[InputRequired()])
    enterprise = StringField('Enterprise',validators=[InputRequired()])
    vat = IntegerField('VAT number',validators=[InputRequired()])
    country = StringField('Country',validators=[InputRequired()])
    province = StringField('Province',validators=[InputRequired()])
    zipcode = StringField('Zipcode',validators=[InputRequired()])
    address = StringField('Address',validators=[InputRequired()])
    accept_tos = BooleanField('I accept the TOS', validators=[InputRequired("You need to accept")])
