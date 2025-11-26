import { useEffect, useState } from "react";
import BrainIcon from "../assets/BrainIcon";
import NavBar, { DEFAULT_NAVBAR_ICONS } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { StorageKeys } from "../utils/constants";
import api from "../services/api";

export default function Home() {
  interface Mood {
    id: string;
    name: string;
  }

  interface Recommendation {
    id: string;
    title: string;
    rank: number;
    thumbnail_url: null;
    mood: Mood;
    synopsis: string;
    movie_metadata: string;
  }

  const [moods, setMoods] = useState<Mood[]>([]);

  const [areMoodsVisible, setMoodsVisibility] = useState(false);
  const toggleMoodsVisibility = () => setMoodsVisibility(!areMoodsVisible);

  const navigate = useNavigate();
  useEffect(() => {
    const goToLoginPage = () => navigate("/login"); // redefinido para evitar chaining de chamadas dependentes
    const accessToken = localStorage.getItem(StorageKeys.ACCESS_TOKEN);

    if (!accessToken) {
      console.warn("Sem token de acesso. Redirecionando para login.");
      goToLoginPage();
      return;
    }

    const fetchMoodsFromAPI = async () => {
      await api
        .get("/api/moods/")
        .then(response => {
          console.log(response.data);
          setMoods(response.data);
        })
        .catch(error => {
          console.error("Erro no fetch: ", error);
        });
    };

    fetchMoodsFromAPI();
  }, [navigate]);

  const fetchRecommendations = async (id: string) => {
    await api.post("/api/recommendations/", { mood_id: id }).then(response => {
      const recommendations: Recommendation[] = response.data;
      console.log(recommendations);
    });
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

      <div
        className="
          flex grow place-content-center-safe place-items-center-safe
          row-start-2 row-span-8 col-start-1 col-span-3 w-full h-full
        "
      >
        <div className="size-160 relative">
          <BrainIcon
            className="
              w-4/10 h-4/10 left-3/10 top-3/10 absolute 
              bg-cinemind-pink rounded-full 
              fill-cinemind-white cursor-pointer
              z-10
            "
            viewBox="-32 -32 576 576"
            onClick={toggleMoodsVisibility}
          />
          {moods.map((mood, index) => {
            return (
              <button
                className="
                  w-1/5 h-1/5 left-2/5 top-2/5 absolute
                  align-middle text-center z-0
                "
                style={{
                  rotate: `${(360 / moods.length) * index}deg`
                }}
                key={index}
                onClick={() => fetchRecommendations(mood.id)}
              >
                <p
                  className={`
                    w-full h-full flex place-items-center place-content-center
                    bg-cinemind-blue rounded-full cursor-pointer
                    text-cinemind-white font-cinemind-sans text-lg
                    ${areMoodsVisible && "animate-moveout"}
                  `}
                  style={{
                    rotate: `${-(360 / moods.length) * index}deg`
                  }}
                >
                  {mood.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

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
