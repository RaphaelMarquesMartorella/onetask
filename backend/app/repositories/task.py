from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task, TaskStatus, TaskPriority
from app.schemas.task import TaskCreate, TaskUpdate


class TaskRepository:
    """Repository for task database operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, task_id: UUID) -> Task | None:
        """Get a task by ID."""
        result = await self.db.execute(
            select(Task).where(Task.id == task_id)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        project_id: UUID | None = None,
        status: TaskStatus | None = None,
        assignee_id: UUID | None = None,
        priority: TaskPriority | None = None,
    ) -> list[Task]:
        """Get all tasks with optional filtering."""
        query = select(Task)

        if project_id:
            query = query.where(Task.project_id == project_id)

        if status:
            query = query.where(Task.status == status)

        if assignee_id:
            query = query.where(Task.assignee_id == assignee_id)

        if priority:
            query = query.where(Task.priority == priority)

        query = query.order_by(Task.position, Task.created_at)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_project(self, project_id: UUID) -> list[Task]:
        """Get all tasks for a project."""
        result = await self.db.execute(
            select(Task)
            .where(Task.project_id == project_id)
            .order_by(Task.position, Task.created_at)
        )
        return list(result.scalars().all())

    async def create(self, task_data: TaskCreate, created_by: UUID) -> Task:
        """Create a new task."""
        task = Task(
            project_id=task_data.project_id,
            title=task_data.title,
            description=task_data.description,
            status=task_data.status,
            priority=task_data.priority,
            assignee_id=task_data.assignee_id,
            due_date=task_data.due_date,
            estimated_hours=task_data.estimated_hours,
            created_by=created_by,
        )
        self.db.add(task)
        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def update(self, task: Task, task_data: TaskUpdate) -> Task:
        """Update a task."""
        update_data = task_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def update_status(
        self,
        task: Task,
        status: TaskStatus,
        position: int | None = None,
    ) -> Task:
        """Update task status (for Kanban drag-and-drop)."""
        task.status = status
        if position is not None:
            task.position = position

        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def delete(self, task: Task) -> None:
        """Delete a task."""
        await self.db.delete(task)
        await self.db.commit()
