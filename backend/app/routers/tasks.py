from uuid import UUID

from fastapi import APIRouter, Query, status

from app.models.task import TaskStatus, TaskPriority
from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskStatusUpdate,
    TaskResponse,
)
from app.services.task import TaskService
from app.utils.dependencies import CurrentUser, DbSession

router = APIRouter(prefix="/api/tasks", tags=["Tarefas"])


@router.get(
    "/",
    response_model=list[TaskResponse],
    summary="Listar tarefas",
    description="Retorna uma lista de tarefas com opções de filtro.",
)
async def list_tasks(
    db: DbSession,
    current_user: CurrentUser,
    project_id: UUID | None = Query(None, description="Filtrar por projeto"),
    status: TaskStatus | None = Query(None, description="Filtrar por status"),
    assignee_id: UUID | None = Query(None, description="Filtrar por responsável"),
    priority: TaskPriority | None = Query(None, description="Filtrar por prioridade"),
):
    """List all tasks with optional filtering."""
    task_service = TaskService(db)
    return await task_service.get_all(
        project_id=project_id,
        status=status,
        assignee_id=assignee_id,
        priority=priority,
    )


@router.post(
    "/",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar tarefa",
    description="Cria uma nova tarefa em um projeto.",
)
async def create_task(
    task_data: TaskCreate,
    db: DbSession,
    current_user: CurrentUser,
):
    """Create a new task."""
    task_service = TaskService(db)
    return await task_service.create(task_data, current_user)


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Obter tarefa",
    description="Retorna os detalhes de uma tarefa.",
)
async def get_task(
    task_id: UUID,
    db: DbSession,
    current_user: CurrentUser,
):
    """Get a task by ID."""
    task_service = TaskService(db)
    return await task_service.get_by_id(task_id)


@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Atualizar tarefa",
    description="Atualiza os dados de uma tarefa existente.",
)
async def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    db: DbSession,
    current_user: CurrentUser,
):
    """Update a task."""
    task_service = TaskService(db)
    return await task_service.update(task_id, task_data)


@router.delete(
    "/{task_id}",
    response_model=dict,
    summary="Excluir tarefa",
    description="Exclui uma tarefa.",
)
async def delete_task(
    task_id: UUID,
    db: DbSession,
    current_user: CurrentUser,
):
    """Delete a task."""
    task_service = TaskService(db)
    return await task_service.delete(task_id)


@router.patch(
    "/{task_id}/status",
    response_model=TaskResponse,
    summary="Atualizar status da tarefa",
    description="Atualiza o status de uma tarefa (otimizado para drag-and-drop do Kanban).",
)
async def update_task_status(
    task_id: UUID,
    status_data: TaskStatusUpdate,
    db: DbSession,
    current_user: CurrentUser,
):
    """Update task status (optimized for Kanban drag-and-drop)."""
    task_service = TaskService(db)
    return await task_service.update_status(task_id, status_data)
