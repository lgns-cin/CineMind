from .base import MIDDLEWARE, BASE_DIR
import os
import dj_database_url

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(' ')
CSRF_TRUSTED_ORIGINS = os.environ.get('CSRF_TRUSTED_ORIGINS', '').split(' ')

DATABASES = {
    'default': dj_database_url.parse(
        os.environ.get('DATABASE_URL', ''),
        # O que tinha antes:
        conn_max_age=600,
        ssl_require=True
    )
}

# WhiteNoise para arquivos estáticos
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'