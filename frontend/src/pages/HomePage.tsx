// frontend/src/pages/HomePage.tsx

import { useEffect, useState } from "react";
import BrainIcon from "../assets/BrainIcon";
import NavBar, { DEFAULT_NAVBAR_ICONS } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { StorageKeys } from "../utils/constants";
import api from "../services/api";
import type { Mood, Recommendation } from "../services/data";
import CircularMoodMenu from "../components/CircularMoodMenu";
import LoadingPopup from "../components/LoadingPopup";
import RecommendationPopup from "../components/RecommendationPopup";

export default function Home() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const goToLoginPage = () => navigate("/login");
    const accessToken = localStorage.getItem(StorageKeys.ACCESS_TOKEN);

    if (!accessToken) {
      console.warn("Sem token de acesso. Redirecionando para login.");
      goToLoginPage();
      return;
    }

    // Carrega os Moods ao iniciar a página
    const fetchMoodsFromAPI = async () => {
      try {
        const response = await api.get("/api/moods/");
        setMoods(response.data);
      } catch (error) {
        console.error("Erro no fetch de moods: ", error);
      }
    };

    fetchMoodsFromAPI();
  }, [navigate]);

  const handleMoodClick = async (id: string) => {
    setIsLoading(true); // Abre o popup de carregamento
    setRecommendations([]); // Limpa recomendações anteriores

    try {
      const response = await api.post("/api/recommendations/", { mood_id: id });
      // Assim que a API responde, guardamos os dados e paramos o loading
      setRecommendations(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar recomendações:", error);
      setIsLoading(false);
      alert(
        "Ocorreu um erro ao consultar o oráculo de filmes. Tente novamente."
      );
    }
  };

  return (
    <div
      className="
        w-screen h-screen select-none
        bg-linear-to-t from-cinemind-dark to-cinemind-light
        grid grid-rows-10 grid-cols-3
        place-content-center-safe place-items-center-safe
      "
    >
      {/* Componente de Carregamento (aparece enquanto isLoading é true) */}
      {isLoading && <LoadingPopup />}

      {/* Componente de Recomendação (aparece quando temos dados e não estamos carregando) */}
      {!isLoading && recommendations.length > 0 && (
        <RecommendationPopup
          recommendations={recommendations}
          onClose={() => setRecommendations([])}
        />
      )}

      <div
        className="
          place-content-center-safe place-items-center-safe
          row-start-1 row-span-1 col-start-2 w-full h-full
          font-cinemind-serif text-cinemind-white text-xl italic text-center
        "
      >
        <p>Que emoção deseja sentir hoje?</p>
        <p>Clique no ícone abaixo para ver suas opções.</p>
      </div>

      <CircularMoodMenu
        className="
          flex grow place-content-center-safe place-items-center-safe
          row-start-2 row-span-8 col-start-1 col-span-3 w-full h-full
        "
        centerIcon={
          <BrainIcon
            className="
              w-4/10 h-4/10 left-3/10 top-3/10 absolute 
              bg-cinemind-pink rounded-full 
              fill-cinemind-white cursor-pointer
              z-10 hover:scale-105 transition-transform duration-300
            "
            viewBox="-32 -32 576 576"
          />
        }
        moods={moods}
        onMoodClick={(_, mood: Mood) => handleMoodClick(mood.id)}
      />

      <NavBar
        className="
          flex bottom-4 gap-8 p-2 rounded-full overflow-visible relative
          row-start-10 row-span-1 col-start-2
          bg-cinemind-light
        "
        selectedIcon={1}
        icons={DEFAULT_NAVBAR_ICONS}
      />
    </div>
  );
}
