// Importa as funções que serão testadas (validações de username, email e senha)

import {
  isValidUsername,
  isValidEmail,
  isValidPassword
} from "../../src/utils/validators";

// 'describe' agrupa um conjunto de testes relacionados
describe("Util: validators", () => {
  // Testes para isValidUsername
  describe("isValidUsername", () => {
    // 'it' ('test') é um caso de teste individual
    it("deve retornar true para nomes de usuário válidos", () => {
      expect(isValidUsername("matheus")).toBe(true);
      expect(isValidUsername("user_123")).toBe(true);
      expect(isValidUsername("cinemind")).toBe(true);
    });

    it("deve retornar false para nomes de usuário inválidos", () => {
      expect(isValidUsername("us")).toBe(false); // muito curto
      expect(isValidUsername("usuario_muito_longo_para_o_limite")).toBe(false); // muito longo
      expect(isValidUsername("Matheus")).toBe(false); // usou maiúscula
      expect(isValidUsername("user@!")).toBe(false); // usou símbolos
    });
  });

  // Testes para isValidEmail
  describe("isValidEmail", () => {
    it("deve retornar true para emails válidos", () => {
      expect(isValidEmail("teste@email.com")).toBe(true);
      expect(isValidEmail("user.123@servidor.co.uk")).toBe(true);
    });

    it("deve retornar false para emails inválidos", () => {
      expect(isValidEmail("nao-e-email")).toBe(false);
      expect(isValidEmail("teste@email")).toBe(false); // faltou o .com
      expect(isValidEmail("@email.com")).toBe(false); // faltou o nome
    });
  });

  // Testes para isValidPassword
  describe("isValidPassword", () => {
    it("deve retornar true para senhas válidas (min. 8 caracteres)", () => {
      expect(isValidPassword("12345678")).toBe(true);
      expect(isValidPassword("senhaforte!@#")).toBe(true);
    });

    it("deve retornar false para senhas curtas", () => {
      expect(isValidPassword("123")).toBe(false);
      expect(isValidPassword("curta")).toBe(false);
    });
  });
});
