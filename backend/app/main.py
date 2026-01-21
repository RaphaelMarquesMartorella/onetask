from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.config import get_settings
from app.routers import auth, projects, tasks, metrics

settings = get_settings()

DESCRIPTION = """
## OneTask API

API REST para gerenciamento de projetos e tarefas.

### Funcionalidades

* **Autenticação**: Registro, login e gerenciamento de tokens JWT
* **Projetos**: CRUD completo de projetos com paginação e busca
* **Tarefas**: CRUD de tarefas com suporte a Kanban board
* **Métricas**: Dashboard e métricas por projeto

### Autenticação

A API utiliza autenticação JWT. Para acessar os endpoints protegidos:

1. Faça login em `/api/auth/login`
2. Use o `access_token` retornado no header `Authorization: Bearer {token}`
3. Quando o token expirar, use `/api/auth/refresh` com o `refresh_token`
"""

tags_metadata = [
    {
        "name": "Health",
        "description": "Endpoints para verificação de saúde da API.",
    },
    {
        "name": "Autenticação",
        "description": "Registro, login e gerenciamento de tokens.",
    },
    {
        "name": "Projetos",
        "description": "Gerenciamento de projetos.",
    },
    {
        "name": "Tarefas",
        "description": "Gerenciamento de tarefas dentro dos projetos.",
    },
    {
        "name": "Métricas",
        "description": "Métricas e analytics do dashboard.",
    },
]

app = FastAPI(
    title="OneTask API",
    description=DESCRIPTION,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=tags_metadata,
    contact={
        "name": "OneTask",
        "email": "contato@onetask.com",
    },
    license_info={
        "name": "MIT",
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {"status": "healthy", "message": "OneTask API is running"}


@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check endpoint."""
    return {"status": "healthy", "version": "1.0.0"}


# Include routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(metrics.router)
