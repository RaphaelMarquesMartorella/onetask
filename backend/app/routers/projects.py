from uuid import UUID

from fastapi import APIRouter, Query, status

from app.models.project import ProjectStatus
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectDetailResponse,
    ProjectListResponse,
)
from app.services.project import ProjectService
from app.utils.dependencies import CurrentUser, DbSession

router = APIRouter(prefix="/api/projects", tags=["Projetos"])


@router.get(
    "/",
    response_model=ProjectListResponse,
    summary="Listar projetos",
    description="Retorna uma lista paginada de projetos com opções de filtro.",
)
async def list_projects(
    db: DbSession,
    current_user: CurrentUser,
    status: ProjectStatus | None = Query(None, description="Filtrar por status"),
    page: int = Query(1, ge=1, description="Número da página"),
    limit: int = Query(10, ge=1, le=100, description="Itens por página"),
    search: str | None = Query(None, description="Busca por nome, descrição ou cliente"),
):
    """List all projects with pagination and filtering."""
    project_service = ProjectService(db)
    return await project_service.get_all(
        page=page,
        limit=limit,
        status=status,
        search=search,
    )


@router.post(
    "/",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar projeto",
    description="Cria um novo projeto.",
)
async def create_project(
    project_data: ProjectCreate,
    db: DbSession,
    current_user: CurrentUser,
):
    """Create a new project."""
    project_service = ProjectService(db)
    return await project_service.create(project_data, current_user)


@router.get(
    "/{project_id}",
    response_model=ProjectDetailResponse,
    summary="Obter projeto",
    description="Retorna os detalhes de um projeto incluindo suas tarefas.",
)
async def get_project(
    project_id: UUID,
    db: DbSession,
    current_user: CurrentUser,
):
    """Get a project by ID with tasks."""
    project_service = ProjectService(db)
    return await project_service.get_by_id(project_id)


@router.put(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Atualizar projeto",
    description="Atualiza os dados de um projeto existente.",
)
async def update_project(
    project_id: UUID,
    project_data: ProjectUpdate,
    db: DbSession,
    current_user: CurrentUser,
):
    """Update a project."""
    project_service = ProjectService(db)
    return await project_service.update(project_id, project_data)


@router.delete(
    "/{project_id}",
    response_model=dict,
    summary="Arquivar projeto",
    description="Arquiva um projeto (soft delete).",
)
async def delete_project(
    project_id: UUID,
    db: DbSession,
    current_user: CurrentUser,
):
    """Archive a project (soft delete)."""
    project_service = ProjectService(db)
    return await project_service.archive(project_id)
