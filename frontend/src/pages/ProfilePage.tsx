import { useEffect, useState } from "react";
import NavBar, { DEFAULT_NAVBAR_ICONS } from "../components/Navbar";
import api from "../services/api";
import type { UserProfile } from "../services/data";
import HistoryCard from "../components/HistoryCard";
import { useNavigate } from "react-router-dom";
import { StorageKeys } from "../utils/constants";
import BrainIcon from "../assets/BrainIcon";
import ProfileIcon from "../assets/ProfileIcon";
import MovieHistory from "../components/MovieHistory";

/**
 * TODO Trocar ícone do perfil para um UserIcon
 * TODO Extrair carossel para o seu componente próprio
 * TODO Limpar mais o código
 */

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem(StorageKeys.ACCESS_TOKEN);
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        // Agora chamamos o endpoint correto que tem o histórico
        const response = await api.get<UserProfile>("/api/profile/");
        setProfile(response.data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Inverte o histórico para mostrar o mais recente primeiro (se houver perfil)
  // O slice() cria uma cópia para não mutar o estado diretamente
  const historyItems = profile?.history.slice().reverse() || [];

  return (
    <div
      className="
        w-screen h-screen select-none
        bg-linear-to-t from-cinemind-dark to-cinemind-light
        grid grid-rows-10 grid-cols-3
        place-content-center-safe place-items-center-safe
      "
    >
      <div
        className="
          place-content-center-safe place-items-center-safe
          row-start-1 row-span-2 col-start-2 w-1/2 h-full p-8
        "
      >
        <p className="font-cinemind-sans text-cinemind-white text-6xl font-bold text-center">
          PERFIL
        </p>

        <ProfileIcon className="size-24 stroke-cinemind-white fill-transparent" />

        <p className="text-cinemind-white font-cinemind-serif text-2xl font-bold">
          @{profile?.username}
        </p>
        <p className="text-cinemind-white font-cinemind-serif italic text-base">
          {profile?.email}
        </p>
      </div>

      <div
        className="
          grow place-content-center-safe place-items-center-safe
          row-start-4 row-span-6 col-start-1 col-span-3 w-full h-full
          grid grid-rows-3 grid-cols-1 p-8
        "
      >
        <div className="flex items-center row-start-1 col-start-1">
          <p className="text-cinemind-white font-cinemind-sans text-lg font-bold">
            Histórico de Recomendações
          </p>
        </div>

        {isLoading ? (
          <p className="flex text-center text-cinemind-white font-cinemind-serif italic">
            Carregando recomendações...
          </p>
        ) : (
          <MovieHistory
            className="flex items-center justify-center col-start-1 row-span-full w-full"
            items={historyItems}
          />
        )}
      </div>

      <NavBar
        className="
          flex bottom-4 gap-8 p-2 rounded-full overflow-visible relative
          row-start-10 row-span-1 col-start-2
          bg-cinemind-light
        "
        selectedIcon={2}
      />
    </div>
  );
}
