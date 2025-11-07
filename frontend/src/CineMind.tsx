import { Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";

/**
 * O componente base renderizado na tela do site.
 *
 * Não deve conter nada além de {@link Route Routes} para componentes de páginas.
 *
 * IDs de teste internos:
 * - `landing-page` — Refere à página central do site.
 * - `login-page` — Refere à página de login.
 * - `signup-page` — Refere à página de cadastro.
 * - `questionnaire-page` — Refere à página de questionário.
 * - `home-page` — Refere ao Home do site, acessível após login.
 * - `profile-page` — Refere à página de perfil do usuário.
 */
export default function CineMind() {
  return (
    // todos os div são placeholders
    <Routes>
      <Route
        path="/"
        element={<div data-testid="landing-page" />}
      />
      <Route
        path="/login"
        element={
          <div data-testid="login-page">
            <Login />
          </div>
        }
      />
      <Route
        path="/signup"
        element={<div data-testid="signup-page" />}
      />
      <Route
        path="/questionnaire"
        element={<div data-testid="questionnaire-page" />}
      />
      <Route
        path="/home"
        element={<div data-testid="home-page" />}
      />
      <Route
        path="/profile"
        element={<div data-testid="profile-page" />}
      />
    </Routes>
  );
}
