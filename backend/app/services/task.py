from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import TaskStatus, TaskPriority
from app.models.user import User
from app.repositories.project import ProjectRepository
from app.repositories.task import TaskRepository
from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskStatusUpdate,
    TaskResponse,
)


class TaskService:
    """Service for task operations."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.task_repo = TaskRepository(db)
        self.project_repo = ProjectRepository(db)

    async def get_all(
        self,
        project_id: UUID | None = None,
        status: TaskStatus | None = None,
        assignee_id: UUID | None = None,
        priority: TaskPriority | None = None,
    ) -> list[TaskResponse]:
        """Get all tasks with optional filtering."""
        tasks = await self.task_repo.get_all(
            project_id=project_id,
            status=status,
            assignee_id=assignee_id,
            priority=priority,
        )
        return [TaskResponse.model_validate(t) for t in tasks]

    async def get_by_id(self, task_id: UUID) -> TaskResponse:
        """Get a task by ID."""
        task = await self.task_repo.get_by_id(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarefa não encontrada",
            )
        return TaskResponse.model_validate(task)

    async def create(self, task_data: TaskCreate, current_user: User) -> TaskResponse:
        """Create a new task."""
        # Verify project exists
        project = await self.project_repo.get_by_id(task_data.project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Projeto não encontrado",
            )

        task = await self.task_repo.create(task_data, current_user.id)
        return TaskResponse.model_validate(task)

    async def update(self, task_id: UUID, task_data: TaskUpdate) -> TaskResponse:
        """Update a task."""
        task = await self.task_repo.get_by_id(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarefa não encontrada",
            )

        updated_task = await self.task_repo.update(task, task_data)
        return TaskResponse.model_validate(updated_task)

    async def update_status(
        self,
        task_id: UUID,
        status_data: TaskStatusUpdate,
    ) -> TaskResponse:
        """Update task status (for Kanban drag-and-drop)."""
        task = await self.task_repo.get_by_id(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarefa não encontrada",
            )

        updated_task = await self.task_repo.update_status(
            task,
            status_data.status,
            status_data.position,
        )
        return TaskResponse.model_validate(updated_task)

    async def delete(self, task_id: UUID) -> dict[str, str]:
        """Delete a task."""
        task = await self.task_repo.get_by_id(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarefa não encontrada",
            )

        await self.task_repo.delete(task)
        return {"message": "Tarefa excluída com sucesso"}
