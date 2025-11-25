/**
 * Classe que armazena todas as chaves utilizadas no {@link localStorage}.
 *
 * NÃO use {@link localStorage.getItem()} ou {@link localStorage.setItem()}
 * sem fazer referência a um membro deste enum.
 */
export const enum StorageKeys {
  ACCESS_TOKEN = "cinemind/access_token",
  ONBOARDING_DATA = "cinemind/onboarding_data"
}
