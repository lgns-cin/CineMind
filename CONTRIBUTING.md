# Como Contribuir para o CineMind

Nós agradecemos seu interesse em contribuir! Para garantir que o processo seja tranquilo e indolor para todos, por favor, siga o guia de configuração de ambiente e as diretrizes aqui descritas.

## Sumário

1. [Guia de Execução e Desenvolvimento](#guia-de-execução-e-desenvolvimento)
2. [Nosso Fluxo de Colaboração](#nosso-fluxo-de-colaboração)
3. [Builds e Deployment](#builds-e-deployment)
4. [Convenções de Nomenclatura](#convenções-de-nomenclatura)
   1. [Convenções de Código](#convenções-de-código)
   2. [Convenções de Projeto](#convenções-de-projeto)
5. [Convenções de Commit](#convenções-de-commit)

## Guia de Execução e Desenvolvimento

É preciso instalar o projeto e configurar o seu ambiente local antes de começar o desenvolvimento.

1.  **Pré-Requisitos**

    1. Para efetuar a _build_/executar o projeto, instale [Docker](https://www.docker.com).
    2. Para desenvolver o projeto localmente, é preciso instalar as seguintes dependências mínimas:
       - [npm](https://nodejs.org) _(para desenvolvimento front-end)_
       - [Python **3.11**](https://www.python.org/downloads/release/python-31114) _(para desenvolvimento back-end)_

2.  **Instalação e Configuração**

    1. Crie um _fork_ do nosso repositório em sua conta.
    2. Clone o seu _fork_ localmente:

    ```bash
    git clone https://github.com/.../CineMind.git
    cd CineMind
    ```

    3. Crie um arquivo `.env` no diretório `backend/` com as variáveis necessárias _(sem aspas)_. Use o arquivo `.env.example` como exemplo.

3.  **Execução**

    1. Faça a _build_ das imagens e volumes Docker dos serviços:

    ```bash
    docker compose build
    ```

    2. Crie e execute os _containers_. A partir daqui, o projeto está em execução:

    ```bash
    docker compose up
    ```

    Inclua `--watch` no final do comando para atualizar o conteúdo dos _containers_ dinamicamente _(ex.: enquanto edita o código)_.

    Os seguintes _containers_ estarão disponíveis:

    - `cinemind-frontend` _(executa o código do front-end)_
      - Website acessível localmente em `localhost:5173`
    - `cinemind-backend` _(executa o código do back-end)_
      - Website de administração acessível localmente em `localhost:8000`
    - `cinemind-database` _(banco de dados do projeto)_

    3. Caso precise de acesso ao terminal de um _container_ específico:

    ```bash
    docker exec -it <nome-do-container> sh
    ```

    É recomendado o uso do [Docker Desktop](https://www.docker.com/products/docker-desktop).

4.  **Desenvolvimento**

    Como o projeto é executado em _containers_ Docker, as dependências do projeto não foram instaladas localmente.

    É recomendado instalá-las para facilitar o processo de desenvolvimento local.

    1. Acesse `frontend/` e instale as dependências:

    ```bash
    cd frontend
    npm install
    ```

    2. Acesse `backend/` e instale as dependências:

    ```bash
    cd backend
    pip install pipenv # Pule este passo se pipenv já estiver instalado
    pipenv install --dev
    ```

## Builds e Deployment

A API/back-end do CineMind tem deploy no serviço Railway, usando a imagem Docker criada no nosso [pipeline CI/CD automatizado](.github/workflows/publish.yml). Fazemos o deploy do front-end diretamente utilizando o Vercel.

Para produção, o front-end executa `npm run build` para buildar o site.

O back-end roda o script [`build.sh`](./backend/build.sh), como no Dockerfile presente no repositório, utilizando Gunicorn: `./build.sh python -m gunicorn cinemind.wsgi:application -b 0.0.0.0:8000 --timeout 120 --chdir ./src`

## Nosso Fluxo de Colaboração

Nosso processo é baseado em _Issues_ e _Pull Requests_. Caso encontre alguma oportunidade para contribuir ao nosso código, siga esses passos:

1. **Encontre ou crie uma _Issue_:**

   - Antes de começar, verifique no [quadro de _Issues_](https://github.com/lgns-cin/CineMind/issues) se já não existe uma _issue_ para o que você quer fazer.
   - Se for um _bug_ ou uma _feature_ nova, crie uma _issue_ detalhada para que o time possa discuti-la.

2. **Crie sua Branch:**

   - A partir da branch `dev` do seu _fork_, crie uma nova _branch_ seguindo nossas [Convenções de Nomenclatura](#convenções-de-nomenclatura).

3. **Desenvolva e Faça Commits:**

   - Faça suas alterações.
   - Faça commits atômicos usando as nossas [Convenções de Commit](#convenções-de-commit).

4. **Abra um _Pull Request_:**

   - Quando terminar, volte ao seu _fork_ e dê um _pull_ e _merge_ antes de fazer seu _push_.
   - Abra um _Pull Request_ da sua _branch_ para a branch `dev` do repositório principal.
   - Preencha o _template_ do PR, detalhando o que foi feito e vinculando a _issue_ que você está resolvendo (ex: `resolve issue #42`).
   - Certifique-se de que seu PR passa em todos os testes, lint, etc.

5. **Revisão:**
   - Aguarde a revisão do seu código. O time poderá solicitar alterações antes de aprovar e fazer o _merge_.

## Convenções de Nomenclatura

### Convenções de Código

Ao editar o código fonte:

- Use nomes de variáveis e funções descritivos, mas simples.

  - Evite nomes sem significado, salvo quando o propósito da variável é óbvio (ex.: `i` para iterar em um _for loop_)

- Respeite o padrão de indentação de cada arquivo.

- Nomes de arquivos, pastas e quaisquer outros elementos de código nomeáveis devem estar em **inglês**.

  - Se necessário, a documentação e descrição de exceções devem estar em **português**.

- Em _Python_,

  - Siga a convenção `snake_case` para variáveis e funções, e `PascalCase` para classes.

- Em _TypeScript_,

  - Use `camelCase` para variáveis e funções quaisquer.
  - Use `PascalCase` para componentes de React (funções exportadas).
  - Desestruture as propriedades dos componentes nas declarações das funções.

- Documente seu código com anotações de tipo esperado e funcionalidade.

### Convenções de Projeto

Usamos branches específicas para organizar o desenvolvimento:

- **`main`**

  - Esta é a branch de produção. Ela contém a versão final, revisada e estável. Qualquer _push_ direto é proibido.

- **`dev`**

  - Esta é a branch principal de desenvolvimento. Todo código novo deve ser mesclado aqui para testes antes de ir para a `main`. **Sua branch deve ser criada a partir desta.**

- **Branches específicas**
  - Ao criar uma branch para uma _feature_ ou _fix_, siga este padrão:
  * **_Features_:** `feat/<nome-da-feature>`
    - _Exemplo: `feat/login-com-google`_
  * **_Fixes_:** `fix/<descricao-do-bug>`
    - _Exemplo: `fix/reduz-tempo-api`_
  * **Documentação:** `docs/<topico-documentado>`
    - _Exemplo: `docs/atualiza-frontend`_

## Convenções de Commit

Para manter um histórico de versão limpo e legível, seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0).

Cada mensagem de commit deve ser prefixada com um tipo:

- **`feat:`**

  - Adiciona uma nova funcionalidade ao projeto.
  - _Exemplo: `feat: implementa login com Google`_

- **`fix:`**

  - Corrige um bug ou comportamento incorreto no código.
  - _Exemplo: `fix: corrige erro de cálculo do desconto`_

- **Outros prefixos comuns:**
  - `docs:` (Atualizações na documentação)
  - `style:` (Ajustes de formatação, sem mudança lógica)
  - `refactor:` (Refatoração de código sem alterar comportamento)
  - `test:` (Adição ou correção de testes)
  - `chore:` (Manutenção de build, scripts, dependências)

Entre os dois pontos e o prefixo, adicione entre parênteses o escopo do commit, por exemplo:

- `feat(back): otimiza uso de memória ram na chamada à api`
  - Isso sinaliza que o commit afeta apenas código referente à API de IA.

Alguns escopos válidos são: `(front)`, `(back)`, `(project)`.

Caso seu commit cause maiores consequências e chegue até a quebrar outro código ou fluxo existente, coloque um ponto de exclamação antes dos dois pontos:

- `feat(back)!: remove o endpoint [...]`

Ademais, pedimos que todo commit esteja em **português** e no **tempo presente**, e que cada commit tenha apenas uma ação clara.

- _Um bom exemplo de commit:_ `feat: adiciona estilos CSS`
- _Um mau exemplo de commit:_ `remove buttons and redo login page design`
