import { useState } from "react";
import InputBox from "../components/InputBox";
import UserCredentialsIcon from "../assets/UserCredentialsIcon";
import ClosedLockIcon from "../assets/ClosedLockIcon";
import EyeIcon from "../assets/EyeIcon";
import SlashedEyeIcon from "../assets/SlashedEyeIcon";
import { useNavigate } from "react-router-dom";
import EnvelopeIcon from "../assets/EnvelopeIcon";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername
} from "../utils/validators";
import api from "../services/api";
import { StorageKeys } from "../utils/constants";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () =>
    setPasswordVisibility(!isPasswordVisible);

  const submitSignupData = async (event: React.FormEvent) => {
    event.preventDefault(); // impede o recarregamento padrão do form
    setError(""); // reseta mensagens de erro a cada nova tentativa

    const isPasswordValid = isValidPassword(password);
    const isUsernameValid = isValidUsername(username);
    const isEmailValid = isValidEmail(email);

    if (password != confirmedPassword) {
      setError("A senha confirmada não coincide com a senha dada.");
      return;
    }

    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
      setError("Usuário, senha ou email inválidos. Verifique as credenciais.");
      return;
    }

    setIsLoading(true);
    localStorage.removeItem(StorageKeys.ACCESS_TOKEN);

    await api
      .post("/api/register/", {
        username: username,
        email: email,
        password: password
      })
      .then(goToLoginPage)
      .catch(apiError => {
        if (apiError.response && apiError.response.status === 401) {
          // Erro 401 (Não autorizado) - Usuário ou senha incorretos
          setError("Credenciais incorretas. Tente novamente.");
        } else {
          // Outro erro (servidor offline, erro 500, etc)
          setError("Erro ao conectar ao servidor. Tente novamente mais tarde.");
        }
        console.error("Erro no cadastro: ", apiError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const navigate = useNavigate();
  const goToLoginPage = () => navigate("/login");

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
        onSubmit={submitSignupData}
      >
        <p className="place-self-center text-cinemind-white text-6xl font-cinemind-sans font-bold">
          CADASTRO
        </p>

        <InputBox
          type="text"
          className="
              flex p-4 gap-4 place-items-center-safe
              bg-cinemind-light rounded-lg
              text-cinemind-white text-2xl font-cinemind-serif
            "
          placeholder="Email..."
          value={email}
          onChange={event => setEmail(event.currentTarget.value)}
          leftIcon={<EnvelopeIcon className={baseIconProperties} />}
        />

        <InputBox
          type="text"
          className="
              flex p-4 gap-4 place-items-center-safe
              bg-cinemind-light rounded-lg
              text-cinemind-white text-2xl font-cinemind-serif
            "
          placeholder="Nome de usuário..."
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

        <InputBox
          type="password"
          className="
              flex p-4 gap-4 place-items-center-safe
              bg-cinemind-light rounded-lg
              text-cinemind-white text-2xl font-cinemind-serif
            "
          placeholder="Confirmar senha..."
          value={confirmedPassword}
          onChange={event => setConfirmedPassword(event.currentTarget.value)}
          leftIcon={<ClosedLockIcon className={baseIconProperties} />}
        />

        <div className="grid grid-cols-5 grid-rows-2">
          <p
            className="
              flex grow col-span-5 place-self-center-safe text-center
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

          <button
            className="
              col-start-4 row-start-2
              bg-cinemind-blue rounded-lg cursor-pointer
              text-cinemind-dark text-2xl font-cinemind-sans font-semibold
            "
            onClick={goToLoginPage}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
