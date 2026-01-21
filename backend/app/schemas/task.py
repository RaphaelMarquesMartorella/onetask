from datetime import datetime, date
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.task import TaskStatus, TaskPriority


class TaskBase(BaseModel):
    """Base schema for task data."""
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    assignee_id: UUID | None = None
    due_date: date | None = None
    estimated_hours: Decimal | None = Field(None, ge=0, le=999.99)


class TaskCreate(TaskBase):
    """Schema for creating a task."""
    project_id: UUID


class TaskUpdate(BaseModel):
    """Schema for updating a task."""
    title: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    assignee_id: UUID | None = None
    due_date: date | None = None
    estimated_hours: Decimal | None = Field(None, ge=0, le=999.99)
    position: int | None = None


class TaskStatusUpdate(BaseModel):
    """Schema for updating task status (Kanban drag-and-drop)."""
    status: TaskStatus
    position: int | None = None


class TaskResponse(BaseModel):
    """Schema for task response."""
    id: UUID
    project_id: UUID
    title: str
    description: str | None
    status: TaskStatus
    priority: TaskPriority
    assignee_id: UUID | None
    created_by: UUID
    due_date: date | None
    estimated_hours: Decimal | None
    position: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
