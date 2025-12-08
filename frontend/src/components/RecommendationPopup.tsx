import { useState } from "react";
import type { Recommendation } from "../services/data";
import XMarkIcon from "../assets/XMarkIcon";

interface RecommendationPopupProps {
  recommendations: Recommendation[];
  onClose: () => void;
}

export default function RecommendationPopup({
  recommendations,
  onClose
}: RecommendationPopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para ciclar entre os filmes (0 -> 1 -> 2 -> 0 ...)
  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % recommendations.length);
  };

  if (!recommendations || recommendations.length === 0) return null;

  const currentMovie = recommendations[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cinemind-dark/95 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-5xl bg-cinemind-light rounded-3xl shadow-2xl border border-cinemind-white/10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Coluna da Imagem (Poster) */}
        <div className="w-full md:w-5/12 bg-black flex items-center justify-center p-0 relative group">
          {currentMovie.thumbnail_url ? (
            <img
              src={currentMovie.thumbnail_url}
              alt={currentMovie.title}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            />
          ) : (
            <div className="h-full w-full min-h-[300px] bg-cinemind-dark flex items-center justify-center font-cinemind-serif italic text-cinemind-white/30 flex-col gap-2">
              Imagem não encontrada.
            </div>
          )}

          {/* Badge de Rank */}
          <div className="absolute top-4 left-4 bg-cinemind-yellow text-cinemind-dark font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg font-cinemind-sans text-2xl z-10 border-2 border-cinemind-dark">
            #{currentMovie.rank}
          </div>
        </div>

        {/* Coluna de Detalhes */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col relative overflow-y-auto">
          {/* Botão Fechar (X) */}
          <XMarkIcon
            className="size-12 stroke-2 absolute top-6 right-6 stroke-cinemind-white hover:stroke-cinemind-pink transition-colors cursor-pointer p-2"
            onClick={onClose}
          />

          <div className="flex grow flex-col justify-center">
            <h3 className="text-cinemind-blue font-cinemind-sans font-bold tracking-[0.2em] uppercase text-xs mb-3">
              Sua Vibe: {currentMovie.mood.name}
            </h3>

            <h1 className="text-4xl md:text-5xl text-cinemind-white font-cinemind-sans font-bold mb-6 leading-tight">
              {currentMovie.title}
            </h1>

            <div className="w-16 h-1 bg-cinemind-pink mb-6 rounded-full"></div>

            <div className="prose prose-invert">
              <p className="text-cinemind-white/90 text-lg md:text-xl font-cinemind-serif italic leading-relaxed font-light">
                {currentMovie.synopsis ||
                  "Sinopse não disponível para este título."}
              </p>
            </div>
          </div>

          {/* Rodapé / Controles */}
          <div className="mt-10 pt-6 border-t border-cinemind-white/10 flex justify-between items-center">
            <span className="text-cinemind-white/40 font-cinemind-sans text-sm">
              {currentIndex + 1} de {recommendations.length}
            </span>

            <button
              onClick={handleNext}
              className="
                bg-cinemind-blue text-cinemind-dark 
                px-8 py-3 rounded-full 
                font-cinemind-sans font-bold text-lg 
                hover:bg-cinemind-white hover:scale-105 active:scale-95 
                transition-all duration-300 cursor-pointer
              "
            >
              Próximo Filme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
