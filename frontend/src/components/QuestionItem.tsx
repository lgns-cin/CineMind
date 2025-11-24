import type { Question } from "../services/onboardingService";

interface QuestionItemProps {
  question: Question;
  onAnswer: (value: number) => void;
}

export default function QuestionItem({ question, onAnswer }: QuestionItemProps) {
  return (
    <div className="w-full max-w-2xl bg-cinemind-light bg-opacity-50 p-8 rounded-xl shadow-lg border border-cinemind-light border-opacity-30 backdrop-blur-sm animate-fade-in">
      {/* Texto da Pergunta */}
      <h2 className="text-cinemind-white text-2xl font-cinemind-serif text-center mb-8 leading-relaxed">
        {question.description}
      </h2>

      {/* Opções de Resposta (Botões Coloridos) */}
      <div className="flex flex-col gap-4">
        {/* Opção 1: Rosa */}
        <button
          onClick={() => onAnswer(question.first_alternative_value)}
          className="w-full p-4 bg-cinemind-pink text-cinemind-white font-cinemind-sans font-bold text-lg rounded-lg 
                     hover:brightness-110 transition-all transform hover:scale-[1.02] shadow-md active:scale-95"
        >
          {question.first_alternative}
        </button>

        {/* Opção 2: Azul */}
        <button
          onClick={() => onAnswer(question.second_alternative_value)}
          className="w-full p-4 bg-cinemind-blue text-cinemind-dark font-cinemind-sans font-bold text-lg rounded-lg 
                     hover:brightness-110 transition-all transform hover:scale-[1.02] shadow-md active:scale-95"
        >
          {question.second_alternative}
        </button>

        {/* Opção 3: Amarelo */}
        <button
          onClick={() => onAnswer(question.third_alternative_value)}
          className="w-full p-4 bg-cinemind-yellow text-cinemind-dark font-cinemind-sans font-bold text-lg rounded-lg 
                     hover:brightness-110 transition-all transform hover:scale-[1.02] shadow-md active:scale-95"
        >
          {question.third_alternative}
        </button>
      </div>
    </div>
  );
}