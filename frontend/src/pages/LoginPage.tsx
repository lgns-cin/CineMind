import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  isValidUsername,
  isValidEmail,
  isValidPassword
} from "../utils/validators";
import EyeIcon from "../assets/EyeIcon";
import UserCredentialsIcon from "../assets/UserCredentialsIcon";
import ClosedLockIcon from "../assets/ClosedLockIcon";
import SlashedEyeIcon from "../assets/SlashedEyeIcon";
import InputBox from "../components/InputBox";
import api from "../services/api"; // importação do serviço de API (Axios)
import { StorageKeys } from "../utils/constants";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [error, setError] = useState(""); // estado que controla mensagens de erro

  // Estado de carregamento para UX
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () =>
    setPasswordVisibility(!isPasswordVisible);

  const navigate = useNavigate();
  const goToSignupPage = () => navigate("/signup");

  // Lógica de submissão
  const submitLoginData = async (event: React.FormEvent) => {
    event.preventDefault(); // impede o recarregamento padrão do form
    setError(""); // reseta mensagens de erro a cada nova tentativa

    // Validamos a senha (simples por enquanto)
    const isPasswordValid = isValidPassword(password);
    // Validamos o login (username OU email)
    const isLoginValid = isValidUsername(username) || isValidEmail(username);

    // Se alguma das validações falhar, mostramos o erro e retornamos
    if (!isLoginValid || !isPasswordValid) {
      setError("Usuário ou senha inválidos. Verifique as credenciais.");
      return; // Para a execução
    }

    // Inicia a chamada da API
    setIsLoading(true); // Desabilita o botão de login

    await api
      .post("/api/login/", {
        username: username,
        password: password
      })
      .then(response => {
        const data = response.data;

        localStorage.setItem(StorageKeys.ACCESS_TOKEN, data.access_token);

        if (!data.onboarding_status) {
          navigate("/home"); // Navega para home
        } else {
          localStorage.setItem(
            StorageKeys.ONBOARDING_DATA,
            JSON.stringify(data.onboarding_status)
          );
          navigate("/questionnaire");
        }
      })
      .catch(apiError => {
        if (apiError.response && apiError.response.status === 401) {
          // Erro 401 (Não autorizado) - Usuário ou senha incorretos
          setError("Credenciais incorretas. Tente novamente.");
        } else {
          // Outro erro (servidor offline, erro 500, etc)
          setError("Erro ao conectar ao servidor. Tente novamente mais tarde.");
        }
        console.error("Erro no login: ", apiError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const baseIconProperties = "size-12 fill-none stroke-cinemind-white stroke-1";

  return (
    <div
      className="
        w-screen h-screen select-none
        bg-linear-to-t from-cinemind-dark to-cinemind-light
        flex place-content-center-safe place-items-center-safe
      "
    >
      <form
        className="
          w-1/3 h-2/3 justify-stretch items-center-safe
          grid grid-rows-5 gap-8 p-8
          bg-cinemind-pink rounded-lg
        "
        onSubmit={submitLoginData}
      >
        <p className="place-self-center text-cinemind-white text-6xl font-cinemind-sans font-bold">
          LOGIN
        </p>

        <InputBox
          type="text"
          className="
            flex p-4 gap-4 place-items-center-safe
            bg-cinemind-light rounded-lg
            text-cinemind-white text-2xl font-cinemind-serif
          "
          placeholder="Nome de usuário ou email..."
          value={username}
          onChange={event => setUsername(event.currentTarget.value)}
          leftIcon={<UserCredentialsIcon className={baseIconProperties} />}
        />

        <InputBox
          type={isPasswordVisible ? "text" : "password"}
          className="
            flex p-4 gap-4 place-items-center-safe
            bg-cinemind-light rounded-lg
            text-cinemind-white text-2xl font-cinemind-serif
          "
          placeholder="Senha..."
          value={password}
          onChange={event => setPassword(event.currentTarget.value)}
          leftIcon={<ClosedLockIcon className={baseIconProperties} />}
          rightIcon={
            isPasswordVisible ? (
              <EyeIcon
                className={`${baseIconProperties} cursor-pointer`}
                onClick={togglePasswordVisibility}
              />
            ) : (
              <SlashedEyeIcon
                className={`${baseIconProperties} cursor-pointer`}
                onClick={togglePasswordVisibility}
              />
            )
          }
        />

        <div className="grid grid-cols-3 grid-rows-2">
          <p
            className="
              flex grow col-span-3 place-self-center-safe
              text-cinemind-dark text-lg font-cinemind-serif font-semibold
            "
            data-testid="error-text"
          >
            {error}
          </p>

          <input
            type="submit"
            className="
              col-start-2 row-start-2 px-4 py-1
              bg-cinemind-yellow rounded-lg cursor-pointer 
              text-cinemind-dark text-3xl font-cinemind-sans font-semibold
              disabled:bg-gray-500 disabled:cursor-not-allowed
            "
            value={isLoading ? "Entrando..." : "Entrar"} // Muda o texto se estiver carregando
            disabled={isLoading} // Desabilita o botão se estiver carregando
          />
        </div>

        <div className="grid grid-cols-3 place-content-center-safe place-items-center-safe">
          <p
            className="
              col-span-2 justify-self-start 
              text-cinemind-white text-2xl font-cinemind-serif italic underline
            "
          >
            Não tem uma conta?
          </p>

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
      </form>
    </div>
  );
}
