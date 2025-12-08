import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Profile from "../../src/pages/ProfilePage";
import api from "../../src/services/api";

/*
    Mocks e Dados de Teste
*/

// Mock da API como nos outros testes (LoginPage/SignupPage)
jest.mock("../../src/services/api");
const mockedAPI = api as jest.Mocked<typeof api>;

// Mock para simular o localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

// Dados de perfil simulados (com histórico para teste)
const mockUserProfile = {
  username: "mbcv-dev",
  email: "mbcv@cinemind.com",
  history: [
    { id: 1, title: "Filme A" },
    { id: 2, title: "Filme B" }
  ],
  big_five_score: { O: 0, C: 0, E: 0, A: 0, N: 0 }
};

describe("ProfilePage: Testes de Cenário", () => {
  // Configuração básica para simular o roteamento
  const renderProfilePage = (initialUrl: string = "/profile") => {
    return render(
      <MemoryRouter initialEntries={[initialUrl]}>
        <Routes>
          <Route
            path="/login"
            element={<div data-testid="login-page" />}
          />
          <Route
            path="/profile"
            element={<Profile />}
          />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Cenário 1: Falha na Autenticação
  test("Cenário: deve redirecionar para Login se o token de acesso estiver ausente", async () => {
    // token ausente
    mockLocalStorage.getItem.mockReturnValue(null);

    await act(async () => {
      renderProfilePage();
    });

    // Logo o componente de ProfilePage não vai renderizar
    expect(screen.queryByText(/PERFIL/i)).toBeNull();
    // E o Login deve ser carregado
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  // Cenário 2: Estado de Carregamento
  test("Cenário: deve mostrar a mensagem de carregamento inicial", async () => {
    // token existe (simula login)
    mockLocalStorage.getItem.mockReturnValue("fake_token_123");

    // Mock da API em estado de PENDENTE
    mockedAPI.get.mockImplementation(() => new Promise(() => {}));

    renderProfilePage();

    // Logo deve mostrar a mensagem de carregamento
    expect(screen.getByText("Carregando histórico...")).toBeInTheDocument();
  });

  // Cenário 3: Sucesso no Carregamento com Histórico
  test("Cenário: deve renderizar dados do usuário e histórico após sucesso na API", async () => {
    // token existe e a API retorna sucesso
    mockLocalStorage.getItem.mockReturnValue("fake_token_123");
    mockedAPI.get.mockResolvedValue({ data: mockUserProfile });

    await act(async () => {
      renderProfilePage();
    });

    // Logo deve mostrar o título e os dados do usuário
    expect(screen.getByText("PERFIL")).toBeInTheDocument();
    expect(screen.getByText("@mbcv-dev")).toBeInTheDocument();
    expect(screen.getByText("Histórico de Recomendações")).toBeInTheDocument();

    // E deve renderizar os itens do histórico
    expect(screen.getByText("Filme A")).toBeInTheDocument();
    expect(screen.getByText("Filme B")).toBeInTheDocument();

    // E o estado de loading deve ser false
    expect(screen.queryByText("Carregando histórico...")).toBeNull();
  });

  // Cenário 4: Sucesso no Carregamento, Histórico Vazio
  test("Cenário: deve mostrar mensagem de histórico vazio se API retornar lista vazia", async () => {
    // token existe e a API retorna um perfil sem histórico
    const profileSemHistory = { ...mockUserProfile, history: [] };
    mockLocalStorage.getItem.mockReturnValue("fake_token_123");
    mockedAPI.get.mockResolvedValue({ data: profileSemHistory });

    await act(async () => {
      renderProfilePage();
    });

    // Logo deve mostrar a mensagem de histórico vazio
    expect(
      screen.getByText("Nenhum filme recomendado ainda.")
    ).toBeInTheDocument();

    // E não deve mostrar a mensagem de carregamento
    expect(screen.queryByText("Carregando histórico...")).toBeNull();
  });
});
