# Jornada do Usuário (Happy Path) - API CineMind

Este documento descreve o fluxo de ponta a ponta de um novo usuário na API, desde a criação da conta até o recebimento de recomendações.

---

### Passo 1: Registro (Criar a conta)

O usuário "novo_usuario" se cadastra na plataforma.

**Request:** `POST http://localhost:8000/api/register/`

```json
{
  "username": "novo_usuario",
  "email": "usuario@email.com",
  "password": "uma_senha_forte_123"
}
```

**Response:** `(201 Created)`

```json
{
  "id": 5,
  "username": "novo_usuario",
  "email": "usuario@email.com"
}
```

---

### Passo 2: Login (Primeiro Acesso)

O usuário faz login pela primeira vez. A API retorna um token de acesso e avisa que o onboarding é necessário, já enviando as perguntas e gêneros.

**Request:** `POST http://localhost:8000/api/login/`

```json
{
  "username": "novo_usuario",
  "password": "uma_senha_forte_123"
}
```

**Response:** `(200 OK)`

> Nota: O `access_token` abaixo (vamos chamá-lo de `TOKEN_ONBOARDING`) será usado no próximo passo.

```json
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
      {
        "id": "4b0107ea-d732-4a02-8db1-c09a7726f876",
        "description": "Seus planos para o fim de semana foram cancelados...",
        "attribute": "neuroticism",
        "first_alternative_value": 1,
        "second_alternative_value": -1,
        "third_alternative_value": 0
      }
      // ... (restante das 10 perguntas)
    ],
    "genres": [
      {
        "id": "aa122bdb-6d16-42d9-a44c-fc15763dc8c3",
        "name": "Ação"
      },
      {
        "id": "1450661f-7fd8-4563-91fa-63407c67b09c",
        "name": "Aventura"
      }
      // ... (restante dos 19 gêneros)
    ]
  }
}
```

---

### Passo 3: Onboarding (Enviar Formulário)

O usuário preenche o formulário com suas respostas (usando os IDs do Passo 2) e envia seus gêneros favoritos.

**Request:** `POST http://localhost:8000/api/form/`

> **Header obrigatório:** `Authorization: Bearer <TOKEN_ONBOARDING>`

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
    {
      "question_id": "ee672429-b894-42d6-a879-f1384a733ac4",
      "selected_value": 1
    },
    {
      "question_id": "42463215-44aa-4309-928b-a88c7dc00a48",
      "selected_value": 1
    },
    {
      "question_id": "47038b82-e715-4e11-8697-6f83727c41f3",
      "selected_value": 1
    },
    {
      "question_id": "f1064f3c-bd31-4da8-ab13-b888175efb0d",
      "selected_value": 0
    },
    {
      "question_id": "6033862f-1d45-4a75-8935-faaa80a290ba",
      "selected_value": -1
    },
    {
      "question_id": "2cbb13c2-d7fa-4b2b-abcd-58923339c9f3",
      "selected_value": -1
    },
    {
      "question_id": "c882daae-a7f9-4411-9366-dd1c2a649457",
      "selected_value": 1
    },
    {
      "question_id": "d2ec9ff7-ff47-40e3-ad54-647855cb4bf2",
      "selected_value": 1
    }
  ],
  "genre_ids": [
    "aa122bdb-6d16-42d9-a44c-fc15763dc8c3",
    "43068aae-deda-4f18-b329-e950b0ddcec5",
    "f4cc2646-45bf-4e9e-ad1e-f23398c7d00c"
  ]
}
```

**Response:** `(201 Created)`

```json
{
  "message": "Onboarding completado com sucesso!"
}
```

---

### Passo 4: Login (Usuário Completo)

O usuário faz login novamente (talvez em outro dia). A API agora reconhece que ele completou o onboarding e apenas retorna o token.

**Request:** `POST http://localhost:8000/api/login/`

```json
{
  "username": "novo_usuario",
  "password": "uma_senha_forte_123"
}
```

**Response:** `(200 OK)`

> Nota: Este é um **novo token** (vamos chamá-lo de `TOKEN_AUTENTICADO`). Ele será usado para todas as ações futuras.

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNTQ0MTc0LCJpYXQiOjE3NjI1NDA1NzQsImp0aSI6IjU5ZTNhNWFjYmY3NzQ1OWY5ODcwZTk5ODFlN2I0MjFjIiwidXNlcl9pZCI6NX0.fpqeHLncPUVF5HQjSthbQV1qGppsZuVHibYtDbOwlQE",
  "onboarding_status": null
}
```

---

### Passo 5: Buscar Moods

O usuário, já autenticado, decide pedir uma recomendação. Primeiro, ele busca os "moods" (humores) disponíveis.

**Request:** `GET http://localhost:8000/api/moods/`

> **Header obrigatório:** `Authorization: Bearer <TOKEN_AUTENTICADO>`

**Response:** `(200 OK)`

> Nota: O usuário decide que está se sentindo "Alegre" e anota o ID: `0f981df2-000d-4380-942f-46619f64b0ff`.

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
  {
    "id": "21a4464a-c602-4ad8-aa86-afcfc6f26834",
    "name": "Medo/Tensão"
  },
  {
    "id": "212a5500-da2f-4294-845b-8d1c77a52ce6",
    "name": "Curiosidade"
  },
  {
    "id": "d84dc4c1-6cd0-4139-a702-6fb10796dbd4",
    "name": "Relaxamento"
  }
]
```

---

### Passo 6: Gerar Recomendações

O usuário envia o ID do mood "Alegria" para pedir 3 filmes.

**Request:** `POST http://localhost:8000/api/recommendations/`

> **Header obrigatório:** `Authorization: Bearer <TOKEN_AUTENTICADO>`

```json
{
  "mood_id": "0f981df2-000d-4380-942f-46619f64b0ff"
}
```

**Response:** `(201 Created)`
(A API retorna os 3 filmes recomendados)

```json
[
  {
    "id": "f8c4f809-0dfb-4cc1-9dd0-5e9d1647d6a2",
    "title": "Guardi\nões da Gal\n\nxia",
    "rank": 1,
    "thumbnail_url": null,
    "mood": {
      "id": "0f981df2-000d-4380-942f-46619f64b0ff",
      "name": "Alegria"
    },
    "synopsis": "",
    "movie_metadata": "{\"rank\": 1, \"title\": \"Guardi\\n\\u00f5es da Gal\\n\\nxia\", ...}"
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

---

### Passo 7: Consultar Histórico (Perfil)

O usuário consulta seu perfil e agora vê que as recomendações do Passo 6 foram salvas em seu histórico.

**Request:** `GET http://localhost:8000/api/profile/`

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
      "title": "Guardi\nões da Gal\n\nxia",
      "external_id": "tmdb:Guardi\nões da Gal\n\nxia-2014",
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
