@echo off
REM Deployment script for mustso.pritechvior.co.tz subdomain using default settings

echo Starting deployment for mustso.pritechvior.co.tz...

REM Navigate to the backend directory
cd backend

REM Install/upgrade pip packages
echo Installing Python packages...
pip install -r ../requirements.txt

REM Set environment variables for production
set DEBUG=False
set ALLOWED_HOSTS=mustso.pritechvior.co.tz,pritechvior.co.tz

REM Collect static files using default settings
echo Collecting static files...
python manage.py collectstatic --noinput

REM Run migrations using default settings
echo Running database migrations...
python manage.py migrate

echo Deployment completed!
echo.
echo Your subdomain setup:
echo - URL: http://mustso.pritechvior.co.tz/
echo - Admin: http://mustso.pritechvior.co.tz/admin/
echo - API: http://mustso.pritechvior.co.tz/api/
echo.
echo Next steps for cPanel:
echo 1. Upload all files to /public_html/mustso/ directory
echo 2. Create .env file from .env.example with your settings
echo 3. Set up Python app in cPanel pointing to /public_html/mustso/passenger_wsgi.py
echo 4. Install requirements.txt packages in cPanel Python environment
echo 5. Run: python manage.py collectstatic --noinput
echo 6. Run: python manage.py migrate
echo 7. Create superuser: python manage.py createsuperuser
echo 8. Test: http://mustso.pritechvior.co.tz/admin/

pause
