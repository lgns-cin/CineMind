import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const goToLoginPage = () => navigate("/login");
  const goToSignupPage = () => navigate("/signup");

  return (
    <div
      className="
        w-screen h-screen select-none gap-4
        bg-linear-to-t from-cinemind-dark to-cinemind-light
        flex flex-col place-content-center-safe place-items-center-safe
      "
    >
      <div className="text-cinemind-white place-content-center-safe place-items-center-safe">
        <h1 className=" font-cinemind-sans text-8xl font-bold">CineMind</h1>

        <p className="font-cinemind-serif text-xl italic">
          O seu sommelier de filmes.
        </p>
      </div>

      <div className="grid p-4 gap-8 grid-cols-2">
        <button
          className="
              bg-cinemind-yellow rounded-lg cursor-pointer px-4 py-1
              text-cinemind-dark text-xl font-cinemind-sans font-semibold
            "
          type="button"
          onClick={goToLoginPage}
        >
          Login
        </button>

        <button
          className="
              bg-cinemind-blue rounded-lg cursor-pointer px-4 py-1
              text-cinemind-dark text-xl font-cinemind-sans font-semibold
            "
          type="button"
          onClick={goToSignupPage}
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
}
