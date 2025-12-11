"""
Production settings for cPanel hosting
"""
from .settings import *
import os

# Production settings
DEBUG = False

# Update ALLOWED_HOSTS for your subdomain
ALLOWED_HOSTS = [
    'mustso.pritechvior.co.tz',  # Your subdomain
    'pritechvior.co.tz',         # Main domain
    'www.pritechvior.co.tz',     # www version
    'localhost',
    '127.0.0.1',
]

# Database for production (if using MySQL on cPanel)
# Uncomment and configure if you're using MySQL instead of SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Static files configuration for production (for subdomain in mustso directory)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, '..', 'mustso', 'static')

# Media files configuration for production
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, '..', 'mustso', 'media')

# Security settings for production
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# CORS settings for production
CORS_ALLOWED_ORIGINS = [
    "https://mustso.pritechvior.co.tz",  # Your subdomain with HTTPS
    "http://mustso.pritechvior.co.tz",   # Your subdomain with HTTP
    "https://mustso.ac.tz",         # Main domain
]

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', 'django.log'),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

# Create logs directory if it doesn't exist
log_dir = os.path.join(BASE_DIR, 'logs')
if not os.path.exists(log_dir):
    os.makedirs(log_dir)
