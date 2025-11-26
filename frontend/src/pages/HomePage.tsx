import { useEffect, useState } from "react";
import BrainIcon from "../assets/BrainIcon";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { StorageKeys } from "../utils/constants";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const goToLoginPage = () => navigate("/login");
    const accessToken = localStorage.getItem(StorageKeys.ACCESS_TOKEN);

    if (!accessToken) {
      console.warn("Sem token de acesso. Redirecionando para login.");
      goToLoginPage();
      return;
    }
  }, [navigate]);

  const [areMoodsVisible, setMoodsVisibility] = useState(false);
  const toggleMoodsVisibility = () => setMoodsVisibility(!areMoodsVisible);

  const x = [
    "Alegria",
    "Relaxamento",
    "Tristeza",
    "Medo/Tensão",
    "Curiosidade"
  ];

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
          flex grow place-content-center-safe place-items-center-safe
          row-start-1 row-span-1 col-start-2 w-full h-full
          font-cinemind-serif text-cinemind-white text-xl italic text-center
        "
      >
        Que emoção deseja sentir hoje?
        <br />
        Clique no ícone abaixo para ver suas opções.
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
          {x.map((value, index) => {
            return (
              <button
                className="
                  w-1/5 h-1/5 left-2/5 top-2/5 absolute
                  align-middle text-center z-0
                "
                style={{
                  rotate: `${(360 / x.length) * index}deg`
                }}
              >
                <p
                  className={`
                    w-full h-full flex place-items-center place-content-center
                    bg-cinemind-blue rounded-full cursor-pointer
                    text-cinemind-white font-cinemind-sans text-lg
                    ${areMoodsVisible && "animate-moveout"}
                  `}
                  style={{
                    rotate: `${-(360 / x.length) * index}deg`
                  }}
                >
                  {value}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <Navbar selectedIcon={1} />
    </div>
  );
}
