# CineMind (_front-end_)

Este é o manual do desenvolvedor para o serviço do _front-end_ criado para o projeto **CineMind**.

## Sumário

1. [Tecnologias Utilizadas](#tecnologias-utilizadas)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Principais Componentes](#principais-componentes)
4. [Integração com APIs](#integração-com-apis)

## Tecnologias Utilizadas

| Tecnologia                                           | Função                                  |
| ---------------------------------------------------- | --------------------------------------- |
| [Node.js](https://nodejs.org)                        | Organização do projeto                  |
| [npm](https://www.npmjs.com)                         | Gerenciamento de dependências           |
| [TypeScript](https://www.typescriptlang.org)         | Linguagem de programação                |
| [React](https://react.dev)                           | Base do projeto                         |
| [Vite](https://vite.dev)                             | Criação de builds e execução do projeto |
| [Tailwind CSS](https://tailwindcss.com)              | Estilos auxiliares de CSS               |
| [Jest](https://jestjs.io)                            | Suíte de testes                         |
| [React Testing Library](https://testing-library.com) | Complemento à suíte de testes           |
| [Axios](https://axios-http.com)                      | Integração com APIs externas            |
| [ESLint](https://eslint.org)                         | Checagem estática e correção do código  |
| [Prettier](https://prettier.io)                      | Formatação automatizada do código       |

## Estrutura do Projeto

O projeto segue o seguinte formato:

```
(...)
  └───┬frontend/
      │
      ├────public/
      │
      ├───┬src/
      │   ├───assets/
      │   ├───components/
      │   ├───context/
      │   ├───hooks/
      │   ├───pages/
      │   ├───services/
      │   ├───utils/
      │   ├───CineMind.tsx
      │   ├───main.tsx
      │   └───style.css
      │
      ├───┬test/
      │   └───(...)
      │
      ├───Dockerfile
      ├───index.html
      ├───package.json
      ├───package-lock.json
      └───(...)
```

- `public/`
  - Contém todos os _assets_ a serem carregados estaticamente, como o `favicon.svg` (ícone do website).

- `src/`
  - Neste diretório reside todo o código-fonte do projeto, com exceção do código referente a testes.
    - `src/assets/`
      - Contém imagens, ícones, fontes e vídeos, e os componentes React que os representem.
    - `src/components/`
      - Contém componentes React reutilizável, como botões, inputs etc.
    - `src/context/`
      - Armazena contextos globais, como os tokens de autenticação.
    - `src/hooks/`
      - Contém _hooks_ personalizados.
    - `src/pages/`
      - Contém os componentes que representam as páginas do site.

- `test/`
  - O local onde o código referente à suíte de teste é armazenado.
    > _**Obs.:** A estrutura de pastas internas a esta é uma cópia da estrutura de `src/`. Cada componente criado deve ter um teste unitário correspondente em `test/` com o mesmo caminho e nome do original._
    >
    > _Por exemplo, o arquivo `src/components/Button.tsx` deve ter um teste unitário em `test/components/Button.test.tsx`._

- `Dockerfile`
  - Arquivo que contém a rotina de _build_ e criação de imagem Docker para este projeto.

- `index.html`
  - O arquivo `html` em que todo o projeto React é renderizado.

- `package.json`
  - Arquivo que lista todas as dependências do projeto.

- `package-lock.json`
  - Arquivo manipulado pelo gerenciador de dependências que armazena as informações exatas de toda dependência (e suas dependências) no momento em que foram obtidas.

## Principais Componentes

- `src/main.tsx`
  - O único arquivo no projeto que manipula diretamente o `index.html`. Contém o componente principal do site, envelopado por `BrowserRouter`s _(que garantem a capacidade de criar diferentes "telas" com sub-endereços no app)_.
- `src/CineMind.tsx`
  - **O componente principal do projeto.** Seu único papel é rotear todas as páginas aos seus respectivos endereços e atribuir IDs internos para teste a cada página.
- `src/style.css`
  - O _stylesheet_ principal do projeto. Contém apenas as importações da livraria _Tailwind CSS_ e as definições do tema do site.
- `pages/**.tsx`
  - Toda nova página roteada (direta ou indiretamente) pelo componente `CineMind` está inclusa nessa pasta.
- `services/api.ts`
  - Armazena o objeto que serve de "ponte" do serviço do _front-end_ à API do _back-end_.

## Integração com APIs

Usamos a _framework_ Axios como uma camada de abstração para a criação de _requests_ e processamento de _responses_ a APIs externas (como a do próprio projeto).

Para interagir com a API do _back-end_ do projeto, importe o objeto do módulo da API:

```ts
import api from "../services/api";
```

Agora é possível utilizar `api` para criar requests, por exemplo:

```ts
import api from "../services/api";

/* ... */

const address = "api/login"; // Não é preciso usar o endereço completo

const request = {
  username: "nome_usuario",
  password: "uma_senha_forte_123"
}; // Verifique a documentação dos endpoints para saber o que é esperado

/*
 * Use 'await' para evitar problemas de concorrência
 * (ou processe os Promises corretamente)
 */
const response = await api.post(address, request);

/*
 * Confira https://axios-http.com/docs/res_schema
 * para mais detalhes acerca do objeto de resposta
 */
const status = response.status;
console.log(response.data);

/* ... */
```
