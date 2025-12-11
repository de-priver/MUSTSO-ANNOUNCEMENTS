# cPanel Deployment Guide for MUSTSO Announcement System
## Subdomain: mustso.pritechvior.co.tz

## Prerequisites
- cPanel hosting account with Python support
- Subdomain `mustso.pritechvior.co.tz` set up in cPanel
- Access to cPanel File Manager or FTP
- SSH access (optional but recommended)

## Step 1: Upload Files
1. Upload all project files to your cPanel account
2. Create a `mustso` directory in your public_html folder
3. Place the project files in the following structure:
   ```
   /public_html/mustso/
   ├── passenger_wsgi.py
   ├── backend/
   ├── static/ (after collectstatic)
   ├── media/
   └── .htaccess
   ```

## Step 2: Set up Python App in cPanel
1. Go to cPanel → Python App
2. Create a new Python application
3. Set the Python version (3.11 or higher recommended)
4. Set the Application Root to `/public_html/mustso`
5. Set the Application URL to `mustso.pritechvior.co.tz`
6. Set the Application Startup File to `passenger_wsgi.py`
7. Click "Create"

## Step 3: Install Dependencies
1. In the Python App section, click on your app
2. Go to the "Package Installation" section
3. Upload your `requirements.txt` file or install packages manually:
   ```
   Django==5.2.6
   djangorestframework==3.15.2
   django-cors-headers==4.4.0
   django-filter==24.3
   python-dotenv==1.0.1
   Pillow==10.4.0
   ```

## Step 4: Environment Configuration
1. Create a `.env` file in your project root with:
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-domain.com,www.your-domain.com
   ```

## Step 5: Update Production Settings
1. Edit `backend/backend/settings_production.py`
2. Update `ALLOWED_HOSTS` with your actual domain
3. Update `CORS_ALLOWED_ORIGINS` with your frontend URL
4. Configure database settings if using MySQL

## Step 6: Database Setup
1. Run migrations:
   ```bash
   python manage.py migrate --settings=backend.settings_production
   ```
2. Create a superuser:
   ```bash
   python manage.py createsuperuser --settings=backend.settings_production
   ```

## Step 7: Collect Static Files
1. Run the collect static command:
   ```bash
   python manage.py collectstatic --noinput --settings=backend.settings_production
   ```

## Step 8: Verify Static Files
1. Check that static files are served at `/static/`
2. Check that media files are served at `/media/`
3. Verify CSS and other assets load correctly

## Step 9: Test the Application
1. Visit your domain to see the index page
2. Test the admin panel at `/admin/`
3. Test API endpoints at `/api/`

## Troubleshooting Static Files

### If CSS is not loading:
1. Ensure `.htaccess` file is in public_html
2. Check that static files are collected correctly
3. Verify STATIC_URL and STATIC_ROOT settings
4. Check file permissions (755 for directories, 644 for files)

### Common Issues:
- **403 Forbidden**: Check file permissions
- **404 Not Found**: Verify .htaccess rules and file paths
- **500 Internal Server Error**: Check error logs in cPanel

## File Structure on Server:
```
/home/username/public_html/
├── mustso/                   # Your subdomain directory
│   ├── .htaccess            # URL routing for subdomain
│   ├── passenger_wsgi.py    # Python app entry point
│   ├── backend/             # Django application
│   │   ├── manage.py
│   │   ├── backend/
│   │   ├── users/
│   │   ├── announcements/
│   │   ├── leaders/
│   │   └── colleges/
│   ├── static/              # Collected static files (CSS, JS, admin files)
│   ├── media/               # User uploaded files
│   ├── requirements.txt
│   └── .env
└── .htaccess                # Main domain .htaccess (if needed)
```

## Security Notes:
- Keep SECRET_KEY secure
- Set DEBUG=False in production
- Use HTTPS if available
- Regular backups of database and media files
- Keep Django and dependencies updated
