import { act, fireEvent, render, screen } from "@testing-library/react";
import Login from "../../src/pages/LoginPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import api from "../../src/services/api";

/**
 * VERSÃO MOCK DA API
 */
jest.mock("../../src/services/api");
const mockedAPI = api as jest.Mocked<typeof api>;

describe("Componente Login", () => {
  beforeEach(async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={
              <div data-testid="login-page">
                <Login />
              </div>
            }
          />
          <Route
            path="/home"
            element={<div data-testid="home-page" />}
          />
          <Route
            path="/questionnaire"
            element={<div data-testid="questionnaire-page" />}
          />
          <Route
            path="/signup"
            element={<div data-testid="signup-page" />}
          />
        </Routes>
      </MemoryRouter>
    );
  });

  test("Estrutura da página", async () => {
    // Texto "LOGIN" aparece
    expect(await screen.findByText("LOGIN")).toBeInTheDocument();

    // Caixas de input foram carregadas
    expect(await screen.findAllByTestId("input-box")).toHaveLength(2);

    // Área do botão "Entrar"
    expect(await screen.findByTestId("error-text")).toBeInTheDocument();
    expect(await screen.findByText("Entrar")).toBeInTheDocument();

    // Área do botão "Cadastrar"
    expect(await screen.findByText("Não tem uma conta?")).toBeInTheDocument();
    expect(await screen.findByText("Cadastrar")).toBeInTheDocument();
  });

  test("Cenário: cadastro", async () => {
    const signupButton = await screen.findByText("Cadastrar");

    await act(async () => {
      // DADO QUE eu estou na página...
      // QUANDO eu clico em cadastrar...
      fireEvent.click(signupButton);
    });

    // ENTÃO devo ser redirecionado para a página Signup
    expect(screen.queryByTestId("login-page")).toBeNull(); // página login descarregada
    expect(await screen.findByTestId("signup-page")).toBeVisible(); // signup carregado
  });

  test("Cenário: login com informações inválidas", async () => {
    const usernameField = await screen.findByPlaceholderText(/Nome de usuário/);
    const passwordField = await screen.findByPlaceholderText(/Senha/);
    const submitButton = await screen.findByText("Entrar");
    const errorTextContainer = await screen.findByTestId("error-text");

    await act(async () => {
      // DADO QUE eu preenchi dados inválidos...
      fireEvent.change(usernameField, { target: { value: "!@#!@!##@@" } });
      fireEvent.change(passwordField, { target: { value: "bad" } });

      // QUANDO eu clico em entrar...
      fireEvent.click(submitButton);
    });

    // ENTÃO devo encontrar erro (credenciais inválidas)
    expect(errorTextContainer).toHaveTextContent(
      "Usuário ou senha inválidos. Verifique as credenciais."
    );
  });

  test("Cenário: login com uma conta a fazer o questionário", async () => {
    const usernameField = await screen.findByPlaceholderText(/Nome de usuário/);
    const passwordField = await screen.findByPlaceholderText(/Senha/);
    const submitButton = await screen.findByText("Entrar");

    // Resultado mockado da chamada à API
    mockedAPI.post.mockResolvedValueOnce({
      data: [
        {
          access_token: "token",
          onboarding_status: {
            questions: [],
            genres: []
          }
        }
      ]
    });

    await act(async () => {
      // DADO QUE eu preenchi dados cadastrados, mas sem onboarding...
      fireEvent.change(usernameField, {
        target: { value: "valid_username" }
      });
      fireEvent.change(passwordField, {
        target: { value: "123password123" }
      });

      // QUANDO eu clico em entrar...
      fireEvent.click(submitButton);
    });

    // ENTÃO devo ser redirecionado para a página Questionnaire
    expect(screen.queryByTestId("login-page")).toBeNull(); // página login descarregada
    expect(await screen.findByTestId("questionnaire-page")).toBeVisible(); // questionnaire carregado
  });

  test("Cenário: login com uma conta já cadastrada", async () => {
    const usernameField = await screen.findByPlaceholderText(/Nome de usuário/);
    const passwordField = await screen.findByPlaceholderText(/Senha/);
    const submitButton = await screen.findByText("Entrar");

    // Resultado mockado da chamada à API
    mockedAPI.post.mockResolvedValueOnce({
      data: [
        {
          access_token: "token",
          onboarding_status: null // Já fez o questionário
        }
      ]
    });

    await act(async () => {
      // DADO QUE eu preenchi dados já cadastrados...
      fireEvent.change(usernameField, {
        target: { value: "valid_username" }
      });
      fireEvent.change(passwordField, {
        target: { value: "123password123" }
      });

      // QUANDO eu clico em entrar...
      fireEvent.click(submitButton);
    });

    // ENTÃO devo ser redirecionado para a página Home
    expect(screen.queryByTestId("login-page")).toBeNull(); // página login descarregada
    expect(await screen.findByTestId("home-page")).toBeVisible(); // home carregado
  });
});
