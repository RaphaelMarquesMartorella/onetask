# OneTask

Plataforma de gerenciamento de projetos e tarefas com interface Kanban.

**Autor:** Raphael Marques Martorella

**Projeto:** Trabalho de Conclusão de Curso - Pós-Graduação em Desenvolvimento Full Stack (PUCRS)

---

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Executando o Projeto](#executando-o-projeto)
- [API Endpoints](#api-endpoints)
- [Funcionalidades](#funcionalidades)
- [Testes](#testes)

---

## Sobre o Projeto

OneTask é uma aplicação web completa para gerenciamento de projetos e tarefas, desenvolvida como Trabalho de Conclusão de Curso. A plataforma permite que usuários criem projetos, organizem tarefas em um board Kanban com drag-and-drop, e acompanhem métricas de produtividade através de um dashboard.

---

## Tecnologias Utilizadas

### Backend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Python | 3.11+ | Linguagem de programação |
| FastAPI | >=0.109.0 | Framework web assíncrono |
| SQLAlchemy | >=2.0.25 | ORM com suporte async |
| PostgreSQL | 15 | Banco de dados relacional |
| Alembic | >=1.13.0 | Migrations do banco de dados |
| Pydantic | >=2.6.0 | Validação de dados |
| python-jose | >=3.3.0 | Autenticação JWT |
| bcrypt | >=4.0.0 | Hash de senhas |
| pytest | >=7.0.0 | Framework de testes |

### Frontend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Next.js | 16.1.6 | Framework React com App Router |
| React | 19.2.3 | Biblioteca de UI |
| TypeScript | ^5 | Tipagem estática |
| Tailwind CSS | ^4 | Framework CSS utilitário |
| shadcn/ui | - | Componentes de UI |
| TanStack Query | ^5.90.20 | Gerenciamento de estado servidor |
| Zustand | ^5.0.11 | Gerenciamento de estado cliente |
| React Hook Form | ^7.71.1 | Formulários |
| Zod | ^4.3.6 | Validação de schemas |
| dnd-kit | ^6.3.1 | Drag and drop |
| Axios | ^1.13.4 | Cliente HTTP |
| date-fns | ^4.1.0 | Manipulação de datas |
| Lucide React | ^0.563.0 | Ícones |

---

## Estrutura do Projeto

```
pucrs/
├── backend/
│   ├── app/
│   │   ├── models/          # Modelos SQLAlchemy
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   └── task.py
│   │   ├── routers/         # Endpoints da API
│   │   │   ├── auth.py
│   │   │   ├── projects.py
│   │   │   ├── tasks.py
│   │   │   └── metrics.py
│   │   ├── schemas/         # Schemas Pydantic
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── task.py
│   │   │   └── metrics.py
│   │   ├── services/        # Lógica de negócio
│   │   │   ├── auth.py
│   │   │   ├── project.py
│   │   │   ├── task.py
│   │   │   └── metrics.py
│   │   ├── repositories/    # Acesso ao banco de dados
│   │   ├── utils/           # Utilitários e dependências
│   │   ├── config.py        # Configurações
│   │   ├── database.py      # Conexão com banco
│   │   └── main.py          # Aplicação FastAPI
│   ├── alembic/             # Migrations
│   ├── tests/               # Testes automatizados
│   ├── requirements.txt
│   ├── docker-compose.yml
│   └── .env.example
│
└── frontend/
    └── src/
        ├── app/
        │   ├── (auth)/           # Rotas públicas
        │   │   ├── login/
        │   │   └── register/
        │   └── (dashboard)/      # Rotas protegidas
        │       ├── page.tsx      # Dashboard
        │       ├── projects/
        │       │   ├── page.tsx  # Listagem
        │       │   └── [id]/     # Detalhe + Kanban
        │       └── settings/
        ├── components/
        │   ├── ui/              # Componentes base (shadcn)
        │   ├── auth/            # Formulários de autenticação
        │   ├── layout/          # Sidebar, Header, UserMenu
        │   ├── dashboard/       # Cards de métricas
        │   ├── projects/        # Cards e formulários de projeto
        │   ├── kanban/          # Board, Column, TaskCard
        │   └── tasks/           # Modal de detalhes da tarefa
        ├── hooks/               # Custom hooks (useAuth, useProjects, useTasks, useMetrics)
        ├── services/            # Chamadas à API
        ├── stores/              # Zustand stores
        ├── types/               # Tipos TypeScript
        └── lib/                 # Utilitários (api client, utils)
```

---

## Pré-requisitos

- **Node.js** 18+ e npm
- **Python** 3.11+
- **Docker** e Docker Compose (para PostgreSQL)

---

## Instalação e Configuração

### Backend

1. **Navegue até o diretório do backend:**
   ```bash
   cd backend
   ```

2. **Crie e ative o ambiente virtual:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Linux/macOS
   # ou
   venv\Scripts\activate     # Windows
   ```

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

   O arquivo `.env` contém:
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5433/onetask
   SECRET_KEY=sua-chave-secreta-aqui-mudar-em-producao
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7
   ```

5. **Inicie o banco de dados PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

6. **Execute as migrations:**
   ```bash
   alembic upgrade head
   ```

### Frontend

1. **Navegue até o diretório do frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Crie o arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

---

## Executando o Projeto

### Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

O servidor estará disponível em: `http://localhost:8000`

Documentação da API:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Frontend

```bash
cd frontend
npm run dev
```

A aplicação estará disponível em: `http://localhost:3000`

---

## API Endpoints

### Autenticação (`/api/auth`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/auth/login` | Login do usuário |
| POST | `/api/auth/refresh` | Atualizar token de acesso |
| GET | `/api/auth/me` | Dados do usuário atual |

### Projetos (`/api/projects`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects` | Listar projetos (paginado) |
| POST | `/api/projects` | Criar projeto |
| GET | `/api/projects/{id}` | Obter projeto com tarefas |
| PUT | `/api/projects/{id}` | Atualizar projeto |
| DELETE | `/api/projects/{id}` | Arquivar projeto |

### Tarefas (`/api/tasks`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/tasks` | Listar tarefas (com filtros) |
| POST | `/api/tasks` | Criar tarefa |
| GET | `/api/tasks/{id}` | Obter tarefa |
| PUT | `/api/tasks/{id}` | Atualizar tarefa |
| DELETE | `/api/tasks/{id}` | Excluir tarefa |
| PATCH | `/api/tasks/{id}/status` | Atualizar status (Kanban) |

### Métricas (`/api/metrics`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/metrics/dashboard` | Métricas gerais do dashboard |
| GET | `/api/metrics/projects/{id}` | Métricas específicas do projeto |

---

## Funcionalidades

### Autenticação
- Registro de usuários com validação de email
- Login com JWT (access token + refresh token)
- Proteção de rotas no frontend via middleware
- Persistência de sessão com Zustand

### Dashboard
- Cards com métricas: total de projetos, tarefas, concluídas, atrasadas
- Gráfico de tarefas por status (barra de progresso)
- Gráfico de tarefas por prioridade
- Resumo rápido: em progresso, em revisão, minhas tarefas

### Projetos
- Listagem em grid responsivo
- Filtro por status (ativo, concluído, arquivado)
- Busca por nome
- Criar, editar e excluir projetos
- Campos: nome, descrição, cliente, datas de início e entrega

### Board Kanban
- 4 colunas: A Fazer, Em Progresso, Em Revisão, Concluído
- Drag and drop com dnd-kit
- Suporte a touch para dispositivos móveis
- Indicador de scroll horizontal no mobile
- Criação rápida de tarefas

### Tarefas
- Modal completo de detalhes e edição
- Campos: título, descrição, status, prioridade, data de entrega, horas estimadas
- Indicador visual de tarefas atrasadas
- Validação de formulários com Zod

### Configurações
- Página de perfil do usuário
- Abas: Perfil, Notificações, Segurança, Aparência

### Responsividade
- Layout adaptativo para desktop, tablet e mobile
- Sidebar colapsável no mobile
- Scroll snap no Kanban para navegação por colunas

---

## Testes

### Backend

Execute os testes automatizados:

```bash
cd backend
source venv/bin/activate
pytest
```

Os testes utilizam SQLite em memória e cobrem:
- Autenticação (registro, login, refresh token)
- CRUD de projetos
- CRUD de tarefas
- Endpoints de métricas

### Frontend

Build de produção (inclui verificação de tipos):

```bash
cd frontend
npm run build
```

---

## Licença

MIT
