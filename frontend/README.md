# OneTask Frontend

Frontend da plataforma OneTask - Gerenciamento de Projetos e Tarefas.

## Stack Tecnológica

- **Next.js 14** - App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **TanStack Query** - Gerenciamento de estado do servidor
- **Zustand** - Gerenciamento de estado global
- **React Hook Form + Zod** - Formulários e validação
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas
- **axios** - Cliente HTTP

## Pré-requisitos

- Node.js 18+
- Backend rodando em http://localhost:8000

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
# Edite se necessário
```

### 3. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em http://localhost:3000

## Estrutura do Projeto

```
src/
├── app/                 # App Router (páginas)
│   ├── (auth)/          # Páginas públicas (login, registro)
│   ├── (dashboard)/     # Páginas protegidas
│   └── layout.tsx       # Layout raiz
├── components/          # Componentes React
│   ├── ui/              # Componentes shadcn/ui
│   ├── auth/            # Componentes de autenticação
│   ├── dashboard/       # Componentes do dashboard
│   ├── projects/        # Componentes de projetos
│   ├── kanban/          # Componentes do Kanban
│   ├── tasks/           # Componentes de tarefas
│   └── layout/          # Componentes de layout
├── hooks/               # Custom hooks
├── lib/                 # Utilitários e configurações
├── stores/              # Zustand stores
└── types/               # Tipos TypeScript
```

## Scripts

- `npm run dev` - Desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Iniciar produção
- `npm run lint` - Verificar linting
