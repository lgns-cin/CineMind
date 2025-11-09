# recommendations/serializers.py

from rest_framework import serializers
from .models import (
    Genre, Mood, RecommendationItem, ShownHistory
)

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = '__all__'

class RecommendationItemSerializer(serializers.ModelSerializer):
    """
    Serializa um item de recomendação (filme) para a resposta da API.
    """
    mood = MoodSerializer(read_only=True)
    # Extrai a sinopse do JSON de metadados para facilitar o frontend
    synopsis = serializers.SerializerMethodField()
    
    class Meta:
        model = RecommendationItem
        fields = [
            'id', 'title', 'rank', 'thumbnail_url', 'mood', 'synopsis', 
            'movie_metadata' # Mantém os metadados completos
        ]

    def get_synopsis(self, obj):
        try:
            # Tenta extrair 'synopsis' do campo movie_metadata (que é um JSON string)
            import json
            metadata = json.loads(obj.movie_metadata)
            return metadata.get('synopsis', '')
        except Exception:
            return ''

class ShownHistorySerializer(serializers.ModelSerializer):
    """
    Serializa um item do histórico de recomendações (para o /api/profile/).
    """
    mood_name = serializers.CharField(source='mood.name', read_only=True)
    # Puxa o thumbnail do RecommendationItem relacionado
    thumbnail_url = serializers.URLField(source='recommendation_item.thumbnail_url', read_only=True)
    
    class Meta:
        model = ShownHistory
        fields = [
            'id', 'title', 'external_id', 'shown_at', 
            'mood_name', 'thumbnail_url'
        ]

class RecommendationRequestSerializer(serializers.Serializer):
    """
    Serializer para validar o corpo do POST /api/recommendations/
    """
    mood_id = serializers.UUIDField(help_text="O ID do Mood para o qual gerar recomendações.")
