import { use, useState } from "react";
import test from "../../public/favicon.svg";
import { useNavigate } from "react-router-dom";
import {
  isValidUsername,
  isValidEmail,
  isValidPassword
} from "../utils/validators";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [error, setError] = useState(""); // estado que controla mensagens de erro

  const navigate = useNavigate();
  const goToSignupPage = () => navigate("/signup");
  // Lógica de submissão
  const submitLoginData = (event: React.FormEvent) => {
    event.preventDefault(); // impede o recarregamento padrão do form
    setError(""); // reseta mensagens de erro a cada nova tentativa

    // Validamos a senha (simples por enquanto)
    const isPasswordValid = isValidPassword(password);
    // Validamos o login (username OU email)
    const isLoginValid = isValidUsername(username) || isValidEmail(username);

    // Checa resultado
    if (isLoginValid && isPasswordValid) {
      // Sucesso
      console.log("Credenciais válidas. Pronto para enviar para o backend");
      // TODO: aqui faremos a chamada da API (Axios)
      navigate("/home");
    } else {
      // Falha na validação
      setError("Usuário ou senha inválidos. Verifique as credenciais.");
    }
  };

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
          w-1/3 h-2/3 
          grid grid-rows-5 gap-8 p-8
          bg-cinemind-pink rounded-lg
        "
        onSubmit={submitLoginData}
      >
        <p className="place-self-center text-cinemind-white text-6xl font-cinemind-sans font-bold">
          LOGIN
        </p>

        <div className="flex p-4 gap-4 bg-cinemind-light rounded-lg">
          <img
            src={test}
            alt="File"
          />
          <input
            type="text"
            className="flex grow outline-none text-cinemind-white text-2xl font-cinemind-serif italic"
            placeholder="Nome de usuário ou email..."
            value={username}
            onChange={event => {
              setUsername(event.currentTarget.value);
            }}
          />
        </div>

        <div className="flex p-4 gap-4 bg-cinemind-light rounded-lg">
          <img
            src={test}
            alt="File"
          />
          <input
            type={isPasswordVisible ? "text" : "password"}
            className="flex grow outline-none text-cinemind-white text-2xl font-cinemind-serif italic"
            placeholder="Senha..."
            value={password}
            onChange={event => {
              setPassword(event.currentTarget.value);
            }}
          />
          <img
            src={test}
            alt="File"
            onClick={_ => {
              setPasswordVisibility(!isPasswordVisible);
            }}
            className="cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-3 grid-rows-4">
          <input
            type="submit"
            className="col-start-2 row-start-2 row-span-2 bg-cinemind-yellow rounded-lg cursor-pointer text-cinemind-dark text-3xl font-cinemind-sans font-semibold"
            value="Entrar"
          />
        </div>

        <div className="grid grid-cols-3 place-content-center-safe place-items-center-safe">
          <p className="col-span-2 justify-self-start text-cinemind-white text-2xl font-cinemind-serif italic underline">
            Não tem uma conta?
          </p>
          <button
            className="bg-cinemind-blue rounded-lg cursor-pointer px-4 py-1"
            onClick={goToSignupPage}
          >
            <p className="text-cinemind-dark text-xl font-cinemind-sans font-semibold">
              Cadastrar
            </p>
          </button>
        </div>
      </form>
    </div>
  );
}
