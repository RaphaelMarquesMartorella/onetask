# OneTask Backend

Backend API para o OneTask - Plataforma de Gerenciamento de Projetos e Tarefas.

## Stack Tecnológica

- **Python 3.11+**
- **FastAPI** - Framework web moderno e de alta performance
- **SQLAlchemy 2.0** - ORM com suporte async
- **PostgreSQL** - Banco de dados relacional
- **Alembic** - Gerenciamento de migrations
- **JWT** - Autenticação via tokens
- **Pydantic v2** - Validação de dados

## Funcionalidades

- Sistema de autenticação JWT (registro, login, refresh token)
- CRUD completo de projetos com paginação e busca
- CRUD de tarefas com suporte a Kanban board
- Endpoint de atualização de status otimizado para drag-and-drop
- Métricas de dashboard e por projeto
- Documentação Swagger automática

## Setup

### 1. Criar ambiente virtual

```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
# ou
venv\Scripts\activate  # Windows
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 4. Subir o banco de dados

```bash
docker-compose up -d
```

### 5. Executar migrations

```bash
alembic upgrade head
```

### 6. Iniciar o servidor

```bash
uvicorn app.main:app --reload
```

O servidor estará disponível em http://localhost:8000

## Documentação da API

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Endpoints

### Autenticação (`/api/auth`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/register` | Registrar novo usuário |
| POST | `/login` | Login do usuário |
| POST | `/refresh` | Atualizar token de acesso |
| GET | `/me` | Dados do usuário atual |

### Projetos (`/api/projects`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Listar projetos (paginado) |
| POST | `/` | Criar projeto |
| GET | `/{id}` | Obter projeto com tarefas |
| PUT | `/{id}` | Atualizar projeto |
| DELETE | `/{id}` | Arquivar projeto (soft delete) |

### Tarefas (`/api/tasks`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Listar tarefas (com filtros) |
| POST | `/` | Criar tarefa |
| GET | `/{id}` | Obter tarefa |
| PUT | `/{id}` | Atualizar tarefa |
| DELETE | `/{id}` | Excluir tarefa |
| PATCH | `/{id}/status` | Atualizar status (Kanban) |

### Métricas (`/api/metrics`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/dashboard` | Métricas do dashboard |
| GET | `/projects/{id}` | Métricas do projeto |

## Testes

Para executar os testes:

```bash
pytest
```

Para executar com cobertura:

```bash
pytest --cov=app
```

## Estrutura do Projeto

```
backend/
├── alembic/              # Migrations do banco de dados
│   ├── versions/         # Arquivos de migration
│   └── env.py            # Configuração do Alembic
├── app/
│   ├── main.py           # Ponto de entrada da aplicação
│   ├── config.py         # Configurações
│   ├── database.py       # Conexão com banco de dados
│   ├── models/           # Models SQLAlchemy
│   │   ├── user.py       # Model de usuário
│   │   ├── project.py    # Model de projeto
│   │   └── task.py       # Model de tarefa
│   ├── schemas/          # Schemas Pydantic
│   │   ├── user.py       # Schemas de usuário/auth
│   │   ├── project.py    # Schemas de projeto
│   │   ├── task.py       # Schemas de tarefa
│   │   └── metrics.py    # Schemas de métricas
│   ├── routers/          # Endpoints da API
│   │   ├── auth.py       # Rotas de autenticação
│   │   ├── projects.py   # Rotas de projetos
│   │   ├── tasks.py      # Rotas de tarefas
│   │   └── metrics.py    # Rotas de métricas
│   ├── services/         # Lógica de negócios
│   │   ├── auth.py       # Serviço de autenticação
│   │   ├── project.py    # Serviço de projetos
│   │   ├── task.py       # Serviço de tarefas
│   │   └── metrics.py    # Serviço de métricas
│   ├── repositories/     # Acesso a dados
│   │   ├── user.py       # Repositório de usuários
│   │   ├── project.py    # Repositório de projetos
│   │   └── task.py       # Repositório de tarefas
│   └── utils/            # Utilitários
│       ├── security.py   # Funções de segurança (JWT, hash)
│       └── dependencies.py # Dependências do FastAPI
├── tests/                # Testes automatizados
│   ├── conftest.py       # Fixtures de teste
│   ├── test_auth.py      # Testes de autenticação
│   ├── test_projects.py  # Testes de projetos
│   └── test_tasks.py     # Testes de tarefas
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore            # Arquivos ignorados pelo Git
├── alembic.ini           # Configuração do Alembic
├── docker-compose.yml    # Configuração do PostgreSQL
├── Dockerfile            # Build da aplicação
├── requirements.txt      # Dependências Python
└── README.md             # Esta documentação
```

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DATABASE_URL` | URL de conexão do PostgreSQL | `postgresql+asyncpg://postgres:postgres@localhost:5432/onetask` |
| `SECRET_KEY` | Chave secreta para JWT | - |
| `ALGORITHM` | Algoritmo de criptografia JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Tempo de expiração do access token | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Tempo de expiração do refresh token | `7` |

## Licença

MIT
