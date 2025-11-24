import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionItem from "../components/QuestionItem";
import GenreGrid from "../components/GenreGrid";
import {
  submitOnboardingForm,
  type Question,
  type Genre,
  type AnswerSubmission
} from "../services/onboarding";
import { StorageKeys } from "../utils/constants";

export default function QuestionnairePage() {
  const navigate = useNavigate();

  // Estados de Dados
  const [questions, setQuestions] = useState<Question[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Progresso
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerSubmission[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);

  const [phase, setPhase] = useState<"questions" | "genres">("questions");

  useEffect(() => {
    // Busca dados passados pelo Login via LocalStorage
    const loadDataFromStorage = () => {
      try {
        const storedData = localStorage.getItem(StorageKeys.ONBOARDING_DATA);

        if (!storedData) {
          // Se não houver dados, o usuário tentou acessar direto ou deu refresh sem persistência.
          // Redireciona para login para pegar os dados novamente.
          console.warn("Sem dados de onboarding. Redirecionando para login.");
          navigate("/login");
          return;
        }

        const parsedData = JSON.parse(storedData);

        if (parsedData.questions && parsedData.genres) {
          setQuestions(parsedData.questions);
          setGenres(parsedData.genres);
        } else {
          throw new Error("Dados incompletos no storage.");
        }
      } catch (error) {
        console.error("Erro ao ler dados locais:", error);
        localStorage.removeItem(StorageKeys.ACCESS_TOKEN); // Força logout limpo
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadDataFromStorage();
  }, [navigate]);

  const handleAnswerQuestion = (value: number) => {
    const currentQuestion = questions[currentQuestionIndex];

    const newAnswer: AnswerSubmission = {
      question_id: currentQuestion.id,
      selected_value: value
    };

    setAnswers(prev => [...prev, newAnswer]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setPhase("genres");
    }
  };

  const toggleGenre = (id: string) => {
    setSelectedGenreIds(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedGenreIds.length === 0) {
      alert("Por favor, selecione pelo menos um gênero.");
      return;
    }

    try {
      setLoading(true);
      await submitOnboardingForm({
        answers,
        genre_ids: selectedGenreIds
      });

      // Limpa os dados temporários, pois já finalizou
      localStorage.removeItem("onboarding_data");

      // Redireciona para o perfil/home
      navigate("/profile");
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Erro ao salvar suas respostas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cinemind-dark flex items-center justify-center">
        <p className="text-cinemind-white/70 animate-pulse">
          Preparando questionário...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cinemind-dark flex flex-col items-center py-12 px-4"
      data-testid="questionnaire-page"
    >
      {phase === "questions" && questions.length > 0 && (
        <>
          <div className="w-full max-w-2xl mb-8">
            <div className="flex justify-between text-cinemind-white mb-2 font-cinemind-sans">
              <span>
                Questão {currentQuestionIndex + 1} de {questions.length}
              </span>
              <span>
                {Math.round((currentQuestionIndex / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-cinemind-light h-2 rounded-full">
              <div
                className="bg-cinemind-pink h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                }}
              />
            </div>
          </div>

          <QuestionItem
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswerQuestion}
          />
        </>
      )}

      {phase === "genres" && (
        <div className="flex flex-col items-center w-full max-w-4xl animate-fade-in">
          <h2 className="text-3xl text-cinemind-white font-cinemind-serif mb-2 text-center">
            Quais são seus gêneros favoritos?
          </h2>
          <p className="text-cinemind-white/70 mb-8 font-cinemind-sans">
            Selecione um ou mais estilos para calibrar suas recomendações.
          </p>

          <GenreGrid
            genres={genres}
            selectedIds={selectedGenreIds}
            onToggle={toggleGenre}
          />

          <button
            onClick={handleSubmit}
            disabled={selectedGenreIds.length === 0}
            className={`
              mt-12 px-12 py-4 rounded-full text-xl font-bold transition-all transform
              ${
                selectedGenreIds.length > 0
                  ? "bg-gradient-to-r from-cinemind-pink to-cinemind-yellow text-cinemind-dark hover:scale-105 shadow-lg shadow-cinemind-pink/20 cursor-pointer"
                  : "bg-cinemind-light text-cinemind-white/30 cursor-not-allowed"
              }
            `}
          >
            Finalizar Onboarding
          </button>
        </div>
      )}
    </div>
  );
}
