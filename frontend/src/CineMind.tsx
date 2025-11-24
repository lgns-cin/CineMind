import { Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import QuestionnairePage from "./pages/QuestionnairePage"; // Importação nova

/**
 * O componente base renderizado na tela do site.
 */
export default function CineMind() {
  return (
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
        element={
          // Agora renderizamos a página real mantendo o wrapper para consistência se necessário
          // O ID data-testid="questionnaire-page" agora está DENTRO de QuestionnairePage.tsx
          <QuestionnairePage />
        }
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