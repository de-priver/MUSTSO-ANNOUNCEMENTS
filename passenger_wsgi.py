#!/usr/bin/python3.11
import sys
import os

# Add the project directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Add the backend directory to Python path (where manage.py is located)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Set Django settings module to use default settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Set production environment variables
os.environ.setdefault('DEBUG', 'False')
os.environ.setdefault('ALLOWED_HOSTS', 'mustso.pritechvior.co.tz,pritechvior.co.tz')

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application

# Create the WSGI application
application = get_wsgi_application()
