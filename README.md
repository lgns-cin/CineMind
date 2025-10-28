# CineMind

O repositório unificado para todos os serviços relacionados ao software **CineMind**.

Este projeto foi criado para e desenvolvido ao longo da cadeira de **Desenvolvimento de Software** _(CIN0136)_.
O curso requer que equipes formadas aleatoriamente desenvolvam um sistema integrado com APIs de IA generativa.

### Integrantes da Equipe

| Nome                              | GitHub                                             |
| --------------------------------- | -------------------------------------------------- |
| Eduardo Henrique Buarque Almeida  |                                                    |
| Felipe de Aquino Mulato           | [@FelipeMulato](https://github.com/FelipeMulato)   |
| Iury Mikael Sobral dos Santos[^1] | [@LugiaKB](https://github.com/LugiaKB)             |
| Jonas Manoel Barbosa de Lima      |                                                    |
| João Victor Cardoso Lopes[^1]     |                                                    |
| Luan Gustavo Nogueira de Souza    | [@lgns-cin](https://github.com/lgns-cin)           |
| Matheus Braglia Cesar Vieira      | [@mbcv-dev](https://github.com/mbcv-dev)           |
| Willian Neves Rupert Jones        | [@willianrupert](https://github.com/willianrupert) |

[^1]: Iury Mikael foi removido da equipe durante um evento de _Job Rotation_ promovido pelos professores, e João Victor entrou em seu lugar.<sup>[[voltar]](#integrantes-da-equipe)</sup>

## Sumário

1. [Visão Geral](#visão-geral)
2. [Funcionalidades Técnicas](#funcionalidades-técnicas)
3. [Como Contribuir](#como-contribuir)

## Visão Geral

O **CineMind** é um sistema de recomendação de filmes personalizado que utiliza o modelo de personalidade [_Big Five_](<https://pt.wikipedia.org/wiki/Cinco_grandes_(psicologia)>) para sugerir filmes que se alinhem com os traços de personalidade e preferências de gênero do usuário.

A plataforma oferece um questionário para avaliar o perfil do usuário e, com base nisso, gera recomendações de filmes categorizadas por humor.

## Funcionalidades Técnicas

- **Autenticação de Usuário**

  - Sistema completo de registro e login com tokens JWT.

- **Questionário de Personalidade**

  - Um questionário baseado no modelo [_Big Five_](<https://pt.wikipedia.org/wiki/Cinco_grandes_(psicologia)>) para avaliar a personalidade do usuário.

- **Recomendações com IA**

  - Utiliza a API Gemini do Google para gerar recomendações de filmes personalizadas e inteligentes.

- **Categorização por Humor**

  - As recomendações são agrupadas em cinco categorias de humor: _Alegria_, _Tristeza_, _Tensão_, _Curiosidade_ e _Relaxamento_.

- **Preferências de Gênero**

  - Os usuários podem selecionar seus gêneros de filmes favoritos para refinar ainda mais as recomendações.

- **Documentação da API**

  - A API é autodocumentada usando [_drf-spectacular_](https://drf-spectacular.readthedocs.io/en/latest), com [_Swagger UI_](https://swagger.io/tools/swagger-ui/) e [_ReDoc_](https://redocly.com).

Verifique os arquivos `README.md` dentro de cada pasta em `services` para mais detalhes sobre estruturas e tecnologias usadas.

## Como Contribuir

Por favor, leia o nosso [`CONTRIBUTING.md`](CONTRIBUTING.md) para mais informações acerca do processo de instalação e execução, e nosso protocolo de colaboração.
