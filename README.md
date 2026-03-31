# OneTask

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

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
onetask/
├── docker-compose.yml        # Orquestração de todos os serviços
├── diagrama.html             # Diagrama ER do banco de dados
├── README.md
│
├── backend/
│   ├── Dockerfile            # Build do backend
│   ├── entrypoint.sh         # Script de inicialização (migrations)
│   ├── app/
│   │   ├── models/           # Modelos SQLAlchemy
│   │   ├── routers/          # Endpoints da API
│   │   ├── schemas/          # Schemas Pydantic
│   │   ├── services/         # Lógica de negócio
│   │   ├── repositories/     # Acesso ao banco de dados
│   │   ├── utils/            # Utilitários e dependências
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── alembic/              # Migrations
│   ├── tests/                # Testes automatizados
│   ├── init.sql              # Dados iniciais (seed)
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── Dockerfile            # Build do frontend
    └── src/
        ├── app/
        │   ├── (auth)/       # Rotas públicas (login, register)
        │   └── (dashboard)/  # Rotas protegidas
        ├── components/
        │   ├── ui/           # Componentes base (shadcn)
        │   ├── auth/         # Formulários de autenticação
        │   ├── layout/       # Sidebar, Header, UserMenu
        │   ├── dashboard/    # Cards de métricas
        │   ├── projects/     # Cards e formulários de projeto
        │   ├── kanban/       # Board, Column, TaskCard
        │   └── tasks/        # Modal de detalhes da tarefa
        ├── hooks/            # Custom hooks
        ├── services/         # Chamadas à API
        ├── stores/           # Zustand stores
        ├── types/            # Tipos TypeScript
        └── lib/              # Utilitários
```

---

## Pré-requisitos

- **Docker** e Docker Compose

---

## Quick Start (Docker)

Execute toda a aplicação com um único comando:

```bash
docker-compose up -d
```

Isso irá iniciar:
- **PostgreSQL** (porta 5433)
- **Backend API** (porta 8000)
- **Frontend** (porta 3000)

### URLs

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

### Credenciais Padrão

O sistema já vem com dados de exemplo pré-populados:

| Campo | Valor |
|-------|-------|
| Email | `admin@onetask.com` |
| Senha | `admin123` |

Os dados incluem 3 projetos de exemplo com tarefas distribuídas em todas as colunas do Kanban.

### Comandos Docker

```bash
# Iniciar a aplicação
docker-compose up -d

# Parar a aplicação
docker-compose down

# Rebuild após alterações no código
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Desenvolvimento Local (sem Docker)

### Pré-requisitos adicionais
- **Node.js** 18+ e npm
- **Python** 3.11+

### Backend

1. **Inicie o banco de dados (ainda usa Docker):**
   ```bash
   docker-compose up -d db
   ```

2. **Configure o ambiente:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # Linux/macOS
   pip install -r requirements.txt
   cp .env.example .env
   ```

3. **Execute as migrations e inicie:**
   ```bash
   alembic upgrade head
   uvicorn app.main:app --reload
   ```

O servidor estará disponível em: `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
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
