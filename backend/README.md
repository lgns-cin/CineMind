# CineMind (_back-end_)

Este é o manual do desenvolvedor para o _back-end_ criado para o projeto **CineMind**.

Para uma documentação completa e interativa dos _endpoints_ e _serializers_, faça a _build_ do projeto _([veja como](../CONTRIBUTING.md/#guia-de-execução-e-desenvolvimento))_ e acesse o endereço `localhost:8000/api/docs/`.

## Sumário

1. [Tecnologias Utilizadas](#tecnologias-utilizadas)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Principais Componentes](#principais-componentes)
4. [Endpoints da API](#endpoints-da-api)

## Tecnologias Utilizadas

| Tecnologia                                                           | Função                             |
| -------------------------------------------------------------------- | ---------------------------------- |
| [Python 3.11](https://www.python.org/downloads/release/python-31114) | Linguagem de programação           |
| [Django](https://www.djangoproject.com)                              | Base do projeto                    |
| [Django REST Framework](https://www.django-rest-framework.org)       | Criação de APIs na Web             |
| [PostgreSQL](https://www.postgresql.org)                             | Banco de dados do projeto          |
| [pytest](https://docs.pytest.org)                                    | Suíte de testes                    |
| [pipenv](https://pipenv.pypa.io)                                     | Gerenciamento de dependências      |
| [Gunicorn](https://gunicorn.org)                                     | CI/CD para produção                |
| [WhiteNoise](https://whitenoise.readthedocs.io)                      | CI/CD                              |
| [Google Gemini](gemini.google.com)                                   | Inteligência artificial do projeto |

## Estrutura do Projeto

O projeto segue o seguinte formato:

```
(...)
  └───┬backend/
      │
      ├───┬src/
      │   ├───┬accounts/
      │   │   ├───┬management/
      │   │   │   └───commands/
      │   │   ├───migrations/
      │   │   └───tests/
      │   ├───┬cinemind/
      │   │   └───settings/
      │   ├───┬integrations/
      │   │   ├───gemini/
      │   │   ├───openai/
      │   │   └───tmdb/
      │   ├───┬recommendations/
      │   │   ├───migrations/
      │   │   └───tests/
      │   ├───utils/
      │   └───manage.py
      │
      ├───build.sh
      ├───Dockerfile
      ├───.env
      ├───.env.example
      ├───Pipfile
      ├───Pipfile.lock
      └───(...)

```

- `src/`

  - Neste diretório reside todo o código-fonte do projeto, com exceção do código referente a testes.
    - `src/accounts/`
      - ...
        - `src/accounts/management/commands`
          - ...
        - `src/accounts/migrations/`
          - ...
        - `src/accounts/tests/`
          - ...
    - `src/cinemind/`
      - ...
        - `src/cinemind/settings/`
          - ...
    - `src/integrations/`
      - ...
        - `src/cinemind/gemini/`
          - ...
        - `src/cinemind/openai/`
          - ...
        - `src/cinemind/tmdb/`
          - ...
    - `src/recommendations/`
      - ...
        - `src/recommendations/migrations/`
          - ...
        - `src/recommendations/tests/`
          - ...
    - `src/utils/`
      - ...

- `test/`

  - O local onde o código referente à suíte de teste é armazenado.

- `build.sh`

  - _Script_ executado na fase final da rotina de _build_ do projeto.

- `Dockerfile`

  - Arquivo que contém a rotina de _build_ e criação de imagem Docker para este projeto.

- `.env`

  - **Este arquivo não deve estar no repositório remoto.** Contém todas as variáveis de ambiente sensíveis _(como a chave secreta do Django etc.)_.

- `.env.example`

  - Um arquivo de exemplo para a estrutura geral do `.env`.

- `Pipfile`

  - Arquivo que lista todas as dependências do projeto.

- `Pipfile.lock`

  - Arquivo manipulado pelo gerenciador de dependências que armazena as informações exatas de toda dependência (e suas dependências) no momento em que foram obtidas.

## Principais Componentes

- `...`
  - ...

## Endpoints da API

Descrevemos aqui o fluxo de ponta a ponta de um novo usuário na API, desde a criação da conta até o recebimento de recomendações.

**Obs.:** O endereço ao qual deve se mandar os _requests_ pode variar de ambiente para ambiente (em ambiente local, é `localhost:8000`, por exemplo). Portanto, ele é omitido em todos os passos que seguem.

### Passo 1: Cadastro

O usuário `novo_usuario` se cadastra na plataforma.

_**Request:**_ `POST http://.../api/register/`

```jsonc
{
  "username": "novo_usuario",
  "email": "usuario@email.com",
  "password": "uma_senha_forte_123"
}
```

_**Response:**_ `(201 Created)`

```jsonc
{
  "id": 5,
  "username": "novo_usuario",
  "email": "usuario@email.com"
}
```

### Passo 2: Login

O usuário faz login pela primeira vez. A API retorna um token de acesso e avisa que o onboarding é necessário, já enviando as perguntas e gêneros.

_**Request:**_ `POST http://.../api/login/`

```jsonc
{
  "username": "novo_usuario",
  "password": "uma_senha_forte_123"
}
```

_**Response:**_ `(200 OK)`

> _**Nota:** O `access_token` abaixo (vamos chamá-lo de `TOKEN_ONBOARDING`) será usado no próximo passo._

```jsonc
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNTQ0Mzc0LCJpYXQiOjE3NjI1NDA3NzQsImp0aSI6ImE1ODg1M2RhNDNjZTRmYjc5ZTFkMDRhNmY5MmFmODRlIiwidXNlcl9pZCI6Nn0.z6jVmONC3RIsyOjDg6kHIiLVvbal92sDOmtO6UxaRRU",
  "onboarding_status": {
    "questions": [
      {
        "id": "3df8b7e1-2b6a-4bce-8f37-a89a6d008e79",
        "description": "É sexta-feira à noite...",
        "attribute": "extraversion",
        "first_alternative_value": 1,
        "second_alternative_value": -1,
        "third_alternative_value": 0
      },
      ... // (restante das perguntas)
    ],
    "genres": [
      {
        "id": "aa122bdb-6d16-42d9-a44c-fc15763dc8c3",
        "name": "Ação"
      },
      ... // (restante das perguntas)
    ]
  }
}
```

### Passo 3: Onboarding

O usuário preenche o formulário com suas respostas _(usando os IDs do [Passo 2](#passo-2-login))_ e envia seus gêneros favoritos.

_**Request:**_ `POST http://.../api/form/`

> _**Header obrigatório:** `Authorization: Bearer <TOKEN_ONBOARDING>`_

```json
{
  "answers": [
    {
      "question_id": "3df8b7e1-2b6a-4bce-8f37-a89a6d008e79",
      "selected_value": -1
    },
    {
      "question_id": "4b0107ea-d732-4a02-8db1-c09a7726f876",
      "selected_value": 0
    },
    ... // (restante das respostas)
  ],
  "genre_ids": [
    "aa122bdb-6d16-42d9-a44c-fc15763dc8c3",
    "43068aae-deda-4f18-b329-e950b0ddcec5",
    ... // (restante dos gêneros selecionados)
  ]
}
```

_**Response:**_ `(201 Created)`

```json
{
  "message": "Onboarding completado com sucesso!"
}
```

### Passo 4: Login

O usuário faz login novamente. A API agora reconhece que ele completou o onboarding e apenas retorna o token.

_**Request:**_ `POST http://.../api/login/`

```json
{
  "username": "novo_usuario",
  "password": "uma_senha_forte_123"
}
```

_**Response:**_ `(200 OK)`

> _**Nota:** Este é um **novo token** (vamos chamá-lo de `TOKEN_AUTENTICADO`). Ele será usado para todas as ações futuras._

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNTQ0MTc0LCJpYXQiOjE3NjI1NDA1NzQsImp0aSI6IjU5ZTNhNWFjYmY3NzQ1OWY5ODcwZTk5ODFlN2I0MjFjIiwidXNlcl9pZCI6NX0.fpqeHLncPUVF5HQjSthbQV1qGppsZuVHibYtDbOwlQE",
  "onboarding_status": null
}
```

### Passo 5: Buscar Moods

O usuário, já autenticado, decide pedir uma recomendação. Primeiro, ele busca os _moods_ disponíveis.

**Request:** `GET http://localhost:8000/api/moods/`

> **Header obrigatório:** `Authorization: Bearer <TOKEN_AUTENTICADO>`

**Response:** `(200 OK)`

```json
[
  {
    "id": "0f981df2-000d-4380-942f-46619f64b0ff",
    "name": "Alegria"
  },
  {
    "id": "a68b25e2-a78c-45e8-b6aa-daff9d1fb806",
    "name": "Tristeza"
  },
  ... // restante dos moods
]
```

### Passo 6: Gerar Recomendações

O usuário envia o ID do mood desejado para pedir 3 filmes.

> _Para o exemplo que se segue, suponha que o usuário em questão selecione 'Alegria'._

**Request:** `POST http://.../api/recommendations/`

> **Header obrigatório:** `Authorization: Bearer <TOKEN_AUTENTICADO>`

```json
{
  "mood_id": "0f981df2-000d-4380-942f-46619f64b0ff" // Alegria
}
```

**Response:** `(201 Created)`

```json
[
  {
    "id": "f8c4f809-0dfb-4cc1-9dd0-5e9d1647d6a2",
    "title": "Guardiões da Galáxia",
    "rank": 1,
    "thumbnail_url": null,
    "mood": {
      "id": "0f981df2-000d-4380-942f-46619f64b0ff",
      "name": "Alegria"
    },
    "synopsis": "",
    "movie_metadata": "{\"rank\": 1, \"title\": \"Guardiões da Galáxia\", ...}"
  },
  {
    "id": "6158d31d-f6c2-4dad-b3c5-2a9552285773",
    "title": "MIB - Homens de Preto",
    "rank": 2,
    "thumbnail_url": "https://image.tmdb.org/t/p/w500/dZpfLrGiPXaaKGlVw4loCs2QBfx.jpg",
    "mood": {
      "id": "0f981df2-000d-4380-942f-46619f64b0ff",
      "name": "Alegria"
    },
    "synopsis": "",
    "movie_metadata": "{\"rank\": 2, \"title\": \"MIB - Homens de Preto\", ...}"
  },
  {
    "id": "7afede1e-d66b-408a-82be-0875bce9ded5",
    "title": "Heróis Fora de Órbita (Galaxy Quest)",
    "rank": 3,
    "thumbnail_url": null,
    "mood": {
      "id": "0f981df2-000d-4380-942f-46619f64b0ff",
      "name": "Alegria"
    },
    "synopsis": "",
    "movie_metadata": "{\"rank\": 3, \"title\": \"Heróis Fora de Órbita\", ...}"
  }
]
```

### Passo 7: Consultar Histórico

O usuário consulta seu perfil e agora vê que as recomendações do [Passo 6](#passo-6-gerar-recomendações) foram salvas em seu histórico.

**Request:** `GET http://.../api/profile/`

> **Header obrigatório:** `Authorization: Bearer <TOKEN_AUTENTICADO>`

**Response:** `(200 OK)`

```json
{
  "id": 5,
  "username": "novo_usuario",
  "email": "usuario@email.com",
  "history": [
    {
      "id": "6f6d8cd7-5a2b-4230-ac90-0e6147b57100",
      "title": "Guardiões da Galáxia",
      "external_id": "tmdb:Guardiões da Galáxia-2014",
      "shown_at": "2025-11-06T23:31:56.143292Z",
      "mood_name": "Alegria",
      "thumbnail_url": null
    },
    {
      "id": "4ed6a592-a24a-4c5b-950f-16db50b80984",
      "title": "MIB - Homens de Preto",
      "external_id": "tmdb:MIB - Homens de Preto-1997",
      "shown_at": "2025-11-06T23:31:56.143333Z",
      "mood_name": "Alegria",
      "thumbnail_url": "https://image.tmdb.org/t/p/w500/dZpfLrGiPXaaKGlVw4loCs2QBfx.jpg"
    },
    {
      "id": "47088999-a797-4f0e-ada2-41f65425f0e4",
      "title": "Heróis Fora de Órbita (Galaxy Quest)",
      "external_id": "tmdb:Heróis Fora de Órbita (Galaxy Quest)-1999",
      "shown_at": "2025-11-06T23:31:56.143345Z",
      "mood_name": "Alegria",
      "thumbnail_url": null
    }
  ]
}
```
