# backend/src/accounts/views.py

from django.contrib.auth.models import User
from rest_framework import generics, permissions, views, status
from rest_framework.response import Response

from .models import Question, Answer
from .serializers import UserSerializer, QuestionSerializer, AnswerSubmissionSerializer
from .services import AccountService # <--- IMPORTADO

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class QuestionListView(generics.ListAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

class CheckAnswersView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        profile = request.user.profile
        has_submitted = Answer.objects.filter(profile=profile).exists()
        return Response({"has_submitted": has_submitted}, status=status.HTTP_200_OK)

class SubmitAnswersView(views.APIView):
    """
    Recebe as respostas do questionário e as encaminha para o 
    AccountService processar e calcular os scores.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AnswerSubmissionSerializer
    
    def __init__(self, **kwargs):
        # A lógica de negócio agora vive no serviço
        self.account_service = AccountService()
        super().__init__(**kwargs)

    def post(self, request, *args, **kwargs):
        profile = request.user.profile
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        answers_data = serializer.validated_data['answers']

        try:
            # A view apenas orquestra a chamada
            scores = self.account_service.submit_personality_answers(
                profile=profile,
                answers_data=answers_data
            )
            
            return Response({
                "message": "Respostas computadas com sucesso!",
                "scores": scores
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except RuntimeError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except Exception as e:
            print(f"Erro inesperado na SubmitAnswersView: {e}")
            return Response(
                {"error": "Ocorreu um erro inesperado."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )