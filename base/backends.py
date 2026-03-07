# base/backends.py
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User

class EmailBackend(ModelBackend):
    """
    Custom authentication backend that allows users to log in using 
    their email address instead of their username.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        # SimpleJWT might pass the email in the 'username' parameter, 
        # or explicitly in kwargs as 'email'. We check both.
        email = kwargs.get('email', username)
        
        # We use .filter().first() instead of .get() to prevent server crashes 
        # just in case two users accidentally have the same email.
        user = User.objects.filter(email=email).first()
        
        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user
            
        return None