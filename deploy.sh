#!/bin/bash
# Script to deploy Django app on cPanel

echo "Starting deployment..."

# Navigate to the backend directory
cd backend

# Install/upgrade pip packages
echo "Installing Python packages..."
pip install -r ../requirements.txt

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --settings=backend.settings_production

# Run migrations
echo "Running database migrations..."
python manage.py migrate --settings=backend.settings_production

# Create superuser (optional, uncomment if needed)
# echo "Creating superuser..."
# python manage.py createsuperuser --settings=backend.settings_production

echo "Deployment completed!"
echo ""
echo "Next steps for cPanel:"
echo "1. Upload all files to your cPanel file manager"
echo "2. Set up your Python app in cPanel and point it to passenger_wsgi.py"
echo "3. Install requirements.txt packages in cPanel Python environment"
echo "4. Update settings_production.py with your domain and database settings"
echo "5. Run: python manage.py collectstatic --settings=backend.settings_production"
echo "6. Run: python manage.py migrate --settings=backend.settings_production"
