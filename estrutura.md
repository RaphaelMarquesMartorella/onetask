# OneTask MVP - Estrutura Completa

## Escopo do MVP

### O que entra

Autenticação com JWT (login, registro, logout)
CRUD de Projetos (criar, listar, editar, arquivar)
CRUD de Tarefas (criar, listar, editar, excluir, mudar status)
Board Kanban com drag-and-drop
Dashboard com métricas básicas

### O que fica de fora (versão futura)

Comentários em tarefas
Upload de anexos
Sistema de webhooks
Integração com ERP Sankhya
Notificações
Múltiplos workspaces
Convites por email

---

## Modelo de Dados

### Tabela: users

| Campo | Tipo | Observações |
|-------|------|-------------|
| id | UUID | PK |
| email | VARCHAR(255) | Único, não nulo |
| password_hash | VARCHAR(255) | Não nulo |
| name | VARCHAR(100) | Não nulo |
| role | ENUM | 'admin', 'manager', 'member' |
| created_at | TIMESTAMP | Default now() |
| updated_at | TIMESTAMP | Atualiza automaticamente |

### Tabela: projects

| Campo | Tipo | Observações |
|-------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(100) | Não nulo |
| description | TEXT | Opcional |
| client_name | VARCHAR(100) | Opcional |
| status | ENUM | 'active', 'completed', 'archived' |
| start_date | DATE | Opcional |
| due_date | DATE | Opcional |
| created_by | UUID | FK para users |
| created_at | TIMESTAMP | Default now() |
| updated_at | TIMESTAMP | Atualiza automaticamente |

### Tabela: tasks

| Campo | Tipo | Observações |
|-------|------|-------------|
| id | UUID | PK |
| project_id | UUID | FK para projects, não nulo |
| title | VARCHAR(200) | Não nulo |
| description | TEXT | Opcional |
| status | ENUM | 'todo', 'in_progress', 'in_review', 'done' |
| priority | ENUM | 'low', 'medium', 'high' |
| assignee_id | UUID | FK para users, opcional |
| created_by | UUID | FK para users |
| due_date | DATE | Opcional |
| estimated_hours | DECIMAL(5,2) | Opcional |
| position | INTEGER | Para ordenação no Kanban |
| created_at | TIMESTAMP | Default now() |
| updated_at | TIMESTAMP | Atualiza automaticamente |

### Diagrama ER (representação textual)

```
users (1) ----< (N) projects     [created_by]
users (1) ----< (N) tasks        [assignee_id]
users (1) ----< (N) tasks        [created_by]
projects (1) ----< (N) tasks     [project_id]
```

---

## Endpoints da API

### Autenticação

POST /api/auth/register
  Request: { email, password, name }
  Response: { user, access_token, refresh_token }

POST /api/auth/login
  Request: { email, password }
  Response: { user, access_token, refresh_token }

POST /api/auth/refresh
  Request: { refresh_token }
  Response: { access_token }

GET /api/auth/me
  Headers: Authorization Bearer token
  Response: { user }

### Projetos

GET /api/projects
  Headers: Authorization Bearer token
  Query: ?status=active&page=1&limit=10
  Response: { projects[], total, page, limit }

POST /api/projects
  Headers: Authorization Bearer token
  Request: { name, description?, client_name?, start_date?, due_date? }
  Response: { project }

GET /api/projects/{id}
  Headers: Authorization Bearer token
  Response: { project, tasks[] }

PUT /api/projects/{id}
  Headers: Authorization Bearer token
  Request: { name?, description?, client_name?, status?, start_date?, due_date? }
  Response: { project }

DELETE /api/projects/{id}
  Headers: Authorization Bearer token
  Response: { message }
  Obs: Soft delete, muda status para 'archived'

### Tarefas

GET /api/tasks
  Headers: Authorization Bearer token
  Query: ?project_id=uuid&status=todo&assignee_id=uuid&priority=high
  Response: { tasks[] }

POST /api/tasks
  Headers: Authorization Bearer token
  Request: { project_id, title, description?, status?, priority?, assignee_id?, due_date?, estimated_hours? }
  Response: { task }

GET /api/tasks/{id}
  Headers: Authorization Bearer token
  Response: { task }

PUT /api/tasks/{id}
  Headers: Authorization Bearer token
  Request: { title?, description?, status?, priority?, assignee_id?, due_date?, estimated_hours?, position? }
  Response: { task }

DELETE /api/tasks/{id}
  Headers: Authorization Bearer token
  Response: { message }

PATCH /api/tasks/{id}/status
  Headers: Authorization Bearer token
  Request: { status, position? }
  Response: { task }
  Obs: Endpoint específico para drag-and-drop do Kanban

### Dashboard / Métricas

GET /api/metrics/dashboard
  Headers: Authorization Bearer token
  Response: {
    total_projects,
    total_tasks,
    tasks_by_status: { todo, in_progress, in_review, done },
    tasks_by_priority: { low, medium, high },
    overdue_tasks,
    my_tasks_count
  }

GET /api/metrics/projects/{id}
  Headers: Authorization Bearer token
  Response: {
    total_tasks,
    completed_tasks,
    completion_percentage,
    tasks_by_status,
    tasks_by_assignee[]
  }

---

## Telas do Frontend

### Públicas (sem autenticação)

1. Login (/login)
   - Campos: email, senha
   - Link para registro
   - Validação de formulário

2. Registro (/register)
   - Campos: nome, email, senha, confirmar senha
   - Link para login
   - Validação de formulário

### Privadas (com autenticação)

3. Dashboard (/)
   - Cards com métricas: total de projetos, tarefas por status, tarefas atrasadas
   - Lista de tarefas atribuídas ao usuário
   - Acesso rápido aos projetos recentes

4. Lista de Projetos (/projects)
   - Cards de projetos com: nome, cliente, progresso, prazo
   - Filtro por status
   - Busca por nome
   - Botão criar novo projeto
   - Modal ou página de criação/edição

5. Detalhe do Projeto / Board Kanban (/projects/{id})
   - Header com info do projeto
   - 4 colunas: A Fazer, Em Progresso, Em Revisão, Concluído
   - Cards de tarefas arrastáveis
   - Botão adicionar tarefa
   - Filtros por responsável e prioridade

6. Modal/Drawer de Tarefa
   - Visualização e edição dos campos da tarefa
   - Seletor de status, prioridade, responsável
   - Campo de prazo com date picker

---

## Sequência de Implementação (Commits)

### Backend (FastAPI)

Commit 1: feat: setup inicial do projeto backend
  - Estrutura de pastas
  - Configuração do FastAPI
  - Arquivo requirements.txt
  - Docker compose para PostgreSQL local
  - Variáveis de ambiente (.env.example)

Commit 2: feat: configuração do banco de dados
  - Conexão com PostgreSQL via SQLAlchemy
  - Models (User, Project, Task)
  - Migrations com Alembic
  - Script de seed para dados iniciais

Commit 3: feat: sistema de autenticação
  - Rotas de registro e login
  - Geração de JWT (access + refresh token)
  - Middleware de autenticação
  - Rota /me para dados do usuário logado
  - Hash de senha com bcrypt

Commit 4: feat: CRUD de projetos
  - Rotas completas de projetos
  - Validação com Pydantic
  - Filtros e paginação
  - Soft delete (arquivamento)

Commit 5: feat: CRUD de tarefas
  - Rotas completas de tarefas
  - Endpoint específico para mudança de status
  - Filtros por projeto, status, responsável
  - Ordenação por posição (para Kanban)

Commit 6: feat: endpoints de métricas
  - Dashboard geral
  - Métricas por projeto
  - Queries agregadas

Commit 7: feat: documentação da API
  - Configuração do Swagger/OpenAPI
  - Descrições nos endpoints
  - Schemas de exemplo

### Frontend (Next.js)

Commit 8: feat: setup inicial do frontend
  - Projeto Next.js com App Router
  - Configuração do TypeScript
  - Tailwind CSS
  - Estrutura de pastas

Commit 9: feat: configuração de autenticação no frontend
  - Context de autenticação
  - Serviço de API (axios/fetch)
  - Interceptor para token
  - Proteção de rotas

Commit 10: feat: telas de autenticação
  - Página de login
  - Página de registro
  - Validação de formulários
  - Feedback de erros

Commit 11: feat: layout e navegação
  - Sidebar/menu
  - Header com usuário
  - Layout protegido

Commit 12: feat: página de dashboard
  - Cards de métricas
  - Lista de tarefas do usuário
  - Projetos recentes

Commit 13: feat: listagem de projetos
  - Grid de cards
  - Filtros e busca
  - Modal de criação/edição

Commit 14: feat: board kanban
  - Colunas de status
  - Cards de tarefas
  - Drag-and-drop (dnd-kit)
  - Atualização de status via API

Commit 15: feat: modal de tarefa
  - Visualização de detalhes
  - Edição inline
  - Seletores de status, prioridade, responsável

### Finalização

Commit 16: feat: ajustes de responsividade
  - Adaptação mobile
  - Menu hamburguer
  - Touch no Kanban

Commit 17: chore: configuração de deploy
  - Dockerfile
  - Variáveis de produção
  - Scripts de build

Commit 18: docs: documentação do projeto
  - README completo
  - Instruções de instalação
  - Screenshots

---

## Stack Tecnológica Confirmada

### Backend
- Python 3.11+
- FastAPI
- SQLAlchemy + Alembic
- PostgreSQL
- Pydantic
- python-jose (JWT)
- passlib + bcrypt
- Uvicorn

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (componentes)
- React Query (cache/fetch)
- dnd-kit (drag-and-drop)
- Zustand (estado global)
- React Hook Form + Zod (formulários)

### Infraestrutura (Deploy)
- Docker
- AWS Lambda (backend)
- Vercel ou AWS Amplify (frontend)
- Amazon RDS (PostgreSQL)

---

## Estimativa de Tempo

Com auxílio de IA, considerando dedicação focada:

Backend completo: 2-3 dias
Frontend completo: 3-4 dias
Ajustes e testes: 1-2 dias
Documentação: 1 dia

Total estimado: 7-10 dias para MVP funcional