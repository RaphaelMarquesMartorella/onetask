from datetime import datetime, date
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.project import ProjectStatus
from app.schemas.task import TaskResponse


class ProjectBase(BaseModel):
    """Base schema for project data."""
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = None
    client_name: str | None = Field(None, max_length=100)
    start_date: date | None = None
    due_date: date | None = None


class ProjectCreate(ProjectBase):
    """Schema for creating a project."""
    pass


class ProjectUpdate(BaseModel):
    """Schema for updating a project."""
    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = None
    client_name: str | None = Field(None, max_length=100)
    status: ProjectStatus | None = None
    start_date: date | None = None
    due_date: date | None = None


class ProjectResponse(BaseModel):
    """Schema for project response."""
    id: UUID
    name: str
    description: str | None
    client_name: str | None
    status: ProjectStatus
    start_date: date | None
    due_date: date | None
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectDetailResponse(ProjectResponse):
    """Schema for project detail response with tasks."""
    tasks: list[TaskResponse] = []


class ProjectListResponse(BaseModel):
    """Schema for paginated project list."""
    items: list[ProjectResponse]
    total: int
    page: int
    limit: int
