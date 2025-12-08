import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Signup from "../../src/pages/SignupPage";
import api from "../../src/services/api";

/**
 * VERSÃO MOCK DA API
 */
jest.mock("../../src/services/api");
const mockedAPI = api as jest.Mocked<typeof api>;

describe("Componente Signup", () => {
  beforeEach(async () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route
            path="/login"
            element={<div data-testid="login-page" />}
          />
          <Route
            path="/signup"
            element={
              <div data-testid="signup-page">
                <Signup />
              </div>
            }
          />
        </Routes>
      </MemoryRouter>
    );
  });

  test("Estrutura da página", async () => {
    // Texto "CADASTRO" aparece
    expect(await screen.findByText("CADASTRO")).toBeInTheDocument();

    // Caixas de input foram carregadas
    expect(await screen.findAllByTestId("input-box")).toHaveLength(4);

    // div de texto de erro
    expect(await screen.findByTestId("error-text")).toBeInTheDocument();

    // Área do botão "Entrar"
    expect(await screen.findByText("Entrar")).toBeInTheDocument();

    // Área do botão "Voltar"
    expect(await screen.findByText("Voltar")).toBeInTheDocument();
  });

  test("Cenário: cadastro sem confirmação de senha", async () => {
    const passwordField = await screen.findByPlaceholderText(/Senha/);
    const confirmedPasswordField =
      await screen.findByPlaceholderText(/Confirmar/);

    const submitButton = await screen.findByText("Entrar");
    const errorTextContainer = await screen.findByTestId("error-text");

    await act(async () => {
      // DADO QUE eu preenchi senhas que não coincidem...
      fireEvent.change(passwordField, { target: { value: "good" } });
      fireEvent.change(confirmedPasswordField, {
        target: { value: "bad" }
      });

      // QUANDO eu clico em entrar...
      fireEvent.click(submitButton);
    });

    // ENTÃO devo encontrar erro (credenciais inválidas)
    expect(errorTextContainer).toHaveTextContent(
      "A senha confirmada não coincide com a senha dada."
    );
  });

  test("Cenário: cadastro com informações inválidas", async () => {
    const emailField = await screen.findByPlaceholderText(/Email/);
    const usernameField = await screen.findByPlaceholderText(/Nome de usuário/);

    const passwordField = await screen.findByPlaceholderText(/Senha/);
    const confirmedPasswordField =
      await screen.findByPlaceholderText(/Confirmar/);

    const submitButton = await screen.findByText("Entrar");

    const errorTextContainer = await screen.findByTestId("error-text");

    await act(async () => {
      // DADO QUE eu preenchi dados inválidos...
      fireEvent.change(emailField, { target: { value: "abcde" } });
      fireEvent.change(usernameField, { target: { value: "!@#!@!##@@" } });
      fireEvent.change(passwordField, { target: { value: "bad" } });
      fireEvent.change(confirmedPasswordField, { target: { value: "bad" } });

      // QUANDO eu clico em entrar...
      fireEvent.click(submitButton);
    });

    // ENTÃO devo encontrar erro (credenciais inválidas)
    expect(errorTextContainer).toHaveTextContent(
      "Usuário, senha ou email inválidos. Verifique as credenciais."
    );
  });

  test("Cenário: cadastro com informações válidas", async () => {
    const emailField = await screen.findByPlaceholderText(/Email/);
    const usernameField = await screen.findByPlaceholderText(/Nome de usuário/);

    const passwordField = await screen.findByPlaceholderText(/Senha/);
    const confirmedPasswordField =
      await screen.findByPlaceholderText(/Confirmar/);

    const submitButton = await screen.findByText("Entrar");

    // Resultado mockado da chamada à API
    mockedAPI.post.mockResolvedValueOnce({
      data: [
        {
          id: 0,
          username: "username",
          email: "username@email.com"
        }
      ]
    });

    await act(async () => {
      // DADO QUE eu preenchi dados corretamente formatados...
      fireEvent.change(emailField, { target: { value: "username@email.com" } });
      fireEvent.change(usernameField, { target: { value: "username" } });
      fireEvent.change(passwordField, { target: { value: "123password123" } });
      fireEvent.change(confirmedPasswordField, {
        target: { value: "123password123" }
      });
      // QUANDO eu clico em entrar...
      fireEvent.click(submitButton);
    });

    // ENTÃO devo ser redirecionado para a página Login
    expect(screen.queryByTestId("signup-page")).toBeNull(); // signup descarregada
    expect(await screen.findByTestId("login-page")).toBeVisible(); // login carregado
  });
});
