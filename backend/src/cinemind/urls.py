"""
URL configuration for cinemind project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# cinemind/urls.py

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

# Importar as views consolidadas dos apps
from accounts import views as accounts_views
from recommendations import views as recs_views

# --- NOVAS ROTAS PLANAS DA API ---
urlpatterns_api = [
    # 1. POST /api/register/
    path('api/register/', accounts_views.RegisterView.as_view(), name='api-register'),
    
    # 2. POST /api/login/
    path('api/login/', accounts_views.LoginOnboardingView.as_view(), name='api-login'),
    
    # 3. POST /api/form/
    path('api/form/', accounts_views.OnboardingFormSubmitView.as_view(), name='api-form-submit'),
    
    # 4. GET /api/moods/
    path('api/moods/', recs_views.MoodListView.as_view(), name='api-mood-list'),
    
    # 5. POST /api/recommendations/
    path('api/recommendations/', recs_views.GenerateRecommendationView.as_view(), name='api-recommendations'),
    
    # 6. GET /api/profile/
    path('api/profile/', accounts_views.ProfileView.as_view(), name='api-profile'),
]

# --- ROTAS DE ADMIN E DOCUMENTAÇÃO ---
urlpatterns_main = [
    path('admin/', admin.site.urls),
    
    # --- ROTAS ADICIONAIS PARA DOCUMENTAÇÃO ---
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# --- ROTAS ANTIGAS (AGORA VAZIAS) ---
# Deixamos os includes para não quebrar a estrutura, mas os arquivos estarão vazios
urlpatterns_deprecated = [
    path('api/accounts/', include('accounts.urls')),
    path('api/recommendations/', include('recommendations.urls')),
]

urlpatterns = urlpatterns_main + urlpatterns_api

# Nota: As urlpatterns_deprecated são intencionalmente omitidas da lista final
# para desativar as rotas antigas.
