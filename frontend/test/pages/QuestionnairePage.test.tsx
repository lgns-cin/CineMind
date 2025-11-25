import { MemoryRouter, Route, Routes } from "react-router-dom";
import Questionnaire from "../../src/pages/QuestionnairePage";
import { render } from "@testing-library/react";

describe("Componente Questionnaire", () => {
  beforeEach(async () => {
    render(
      <MemoryRouter initialEntries={["/questionnaire"]}>
        <Routes>
          <Route
            path="/login"
            element={<div data-testid="login-page" />}
          />
          <Route
            path="/questionnaire"
            element={
              <div data-testid="questionnaire-page">
                <Questionnaire />
              </div>
            }
          />
          <Route
            path="/home"
            element={<div data-testid="home-page" />}
          />
        </Routes>
      </MemoryRouter>
    );
  });

  test("Estrutura da página", async () => {});

  test("Cenário: marcar respostas", async () => {});

  test("Cenário: tentar submeter questionário incompleto", async () => {});
});
