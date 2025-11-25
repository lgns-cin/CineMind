import { render, screen } from "@testing-library/react";
import CineMind from "../src/CineMind";
import { MemoryRouter } from "react-router-dom";

describe("Componente CineMind", () => {
  // mantenha esses dados consistentes com os que estão no componente
  const routesToTestIDs = new Map<string, string>([
    ["/", "landing-page"],
    ["/login", "login-page"],
    ["/signup", "signup-page"],
    ["/questionnaire", "questionnaire-page"],
    ["/home", "home-page"],
    ["/profile", "profile-page"]
  ]);

  /** Nomes das rotas que carregam diretamente na página (sem necessidade de autenticação) */
  const exposedRoutes = ["/", "/login", "/signup"];

  /** Nomes das rotas que requerem tokens de autenticação */
  const protectedRoutes = ["/questionnaire" /*, "/home", "/profile" */];
  // Devemos tirar as outras strings do comentário à medida que adicionamos as páginas

  test("Navegação das rotas", async () => {
    for (const [route, testID] of routesToTestIDs.entries()) {
      render(
        <MemoryRouter initialEntries={[route]}>
          <CineMind />
        </MemoryRouter>
      );

      if (exposedRoutes.includes(route)) {
        // A página pode ser visitada
        // O ID de teste deve ser o testID
        expect(await screen.findByTestId(testID)).toBeInTheDocument();
      }

      if (protectedRoutes.includes(route)) {
        // Você deve ser redirecionado a outra página
        // O ID de teste não deve ser o testID
        expect(screen.queryByTestId(testID)).toBeFalsy();
      }
    }
  });
});
