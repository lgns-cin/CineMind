# Em backend/src/cinemind/urls.py
# (Este deve ser o arquivo final e correto)

from django.contrib import admin
from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

# --- INÍCIO DAS IMPORTAÇÕES CORRIGIDAS ---
from accounts.views import (
    RegisterView,
    LoginOnboardingView,
    OnboardingFormSubmitView,
    ProfileView,
)

# Importações de 'recommendations' corrigidas
from recommendations.views import (
    MoodListView,
    GenerateRecommendationView, # <--- CORRIGIDO AQUI
)
# --- FIM DAS IMPORTAÇÕES CORRIGIDAS ---

urlpatterns = [
    path("admin/", admin.site.urls),

    # --- INÍCIO DOS 6 ENDPOINTS SIMPLIFICADOS ---

    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/login/", LoginOnboardingView.as_view(), name="login"),
    path("api/form/", OnboardingFormSubmitView.as_view(), name="form"),
    path("api/moods/", MoodListView.as_view(), name="moods"),
    
    # 5. Gerar Recomendações
    path("api/recommendations/", GenerateRecommendationView.as_view(), name="recommendations"), # <--- CORRIGIDO AQUI
    
    # 6. Perfil do Usuário
    path("api/profile/", ProfileView.as_view(), name="profile"),
    
    # --- FIM DOS 6 ENDPOINTS SIMPLIFICADOS ---

    # Links do Schema/Swagger
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    path("api/moods/", MoodListView.as_view(), name="mood-list"),
    path("api/recommendations/generate/", GenerateRecommendationView.as_view(), name="generate-recommendations")
]
