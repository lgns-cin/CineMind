// Validações simples para username, email e senha

/*
Explicação importante (Regex)
Regex (Expressões Regulares) são sequências de caracteres que formam um padrão de pesquisa (padrão da indústria para validação de strings)
    /^[a-z0-9_]{3,16}$/
    - ^ indica o início da string
    - [a-z0-9_] define um conjunto de caracteres permitidos (letras minúsculas, números e sublinhado)
    - {3,16} especifica que a string deve ter entre 3 e 16 caracteres
    - $ indica o fim da string

*/

// Regex de nome de usuário (3-16 caracteres, apenas letras minúsculas, números e underscore)
const usernameRegex = /^[a-z0-9_]{3,16}$/;

/**
 * Valida o formato do nome de usuário
 *
 * Regras: 3-16 caracteres, apenas letras minúsculas, números e underscore
 *
 * @param username - O nome de usuário a ser validado
 * @returns `true` se o nome de usuário for válido, `false` caso contrário
 */
export const isValidUsername = (username: string): boolean => {
  return usernameRegex.test(username);
};

// Regex de email (tá simplificado por enquanto) - garante que o texto tenha: xxx@yyy.zzz
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida o formato de email simples
 *
 * @param email - O email a ser validado
 * @returns `true` se o email for válido, `false` caso contrário
 */
export const isValidEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

/**
 * Valida a força da senha
 *
 * Regra: Mínimo de 8 caracteres
 * (pode mudar futuramente para algo como "ter pelo menos 1 número", mas vamos ficar no simples por enquanto)
 *
 * @param password - A senha a ser validada
 * @returns `true` se a senha for forte o suficiente, `false` caso contrário
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};
