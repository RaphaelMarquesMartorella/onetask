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

## Setup

### Via Docker (recomendado)

Na raiz do projeto, execute:

```bash
docker-compose up -d
```

O frontend será iniciado automaticamente em http://localhost:3000

### Desenvolvimento Local

1. **Certifique-se de que o backend está rodando** em http://localhost:8000

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env.local
   ```

4. **Inicie o servidor de desenvolvimento:**
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
