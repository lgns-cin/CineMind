import { Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";

/**
 * O componente base renderizado na tela do site.
 *
 * Não deve conter nada além de {@link Route Routes} para componentes de páginas.
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
        element={<Login data-testid="login-page" />}
      />
      <Route
        path="/signup"
        element={<Signup data-testid="signup-page" />}
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
