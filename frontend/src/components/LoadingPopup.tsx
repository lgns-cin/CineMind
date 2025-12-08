import { useEffect, useState } from "react";

export default function LoadingPopup() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lógica de progresso "Assintótica"
    // A barra avança, mas desacelera quanto mais perto chega de 90%
    // Ela nunca chega a 100% sozinha, espera a API terminar.
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev; // Trava em 90% até o componente ser desmontado
        const remaining = 90 - prev;
        // Avança uma fração do que falta (efeito de desaceleração)
        return prev + remaining * 0.05;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cinemind-dark/90 backdrop-blur-sm animate-fade-in cursor-wait">
      <div className="w-3/4 max-w-md p-8 rounded-2xl bg-cinemind-light shadow-2xl border border-cinemind-white/10 flex flex-col items-center gap-6">
        <h2 className="text-2xl text-cinemind-white font-cinemind-serif animate-pulse text-center">
          Consultando os astros do cinema...
        </h2>

        {/* Container da Barra */}
        <div className="w-full h-4 bg-cinemind-dark rounded-full overflow-hidden shadow-inner border border-cinemind-white/10">
          {/* Barra Colorida */}
          <div
            className="h-full bg-gradient-to-r from-cinemind-pink to-cinemind-yellow transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-cinemind-white/60 font-cinemind-sans text-sm text-center">
          Nossa IA está gerando recomendações únicas para o seu perfil. <br />
          Isso pode levar alguns segundos.
        </p>
      </div>
    </div>
  );
}
