import { cleanup, render, screen } from "@testing-library/react";
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

  test("Navegação das rotas", async () => {
    for (const [route, testID] of routesToTestIDs.entries()) {
      render(
        <MemoryRouter initialEntries={[route]}>
          <CineMind />
        </MemoryRouter>
      );

      expect(await screen.findByTestId(testID)).toBeInTheDocument();
    }
  });
});
