from uuid import UUID

from pydantic import BaseModel


class TasksByStatus(BaseModel):
    """Schema for tasks count by status."""
    todo: int = 0
    in_progress: int = 0
    in_review: int = 0
    done: int = 0


class TasksByPriority(BaseModel):
    """Schema for tasks count by priority."""
    low: int = 0
    medium: int = 0
    high: int = 0


class DashboardMetrics(BaseModel):
    """Schema for dashboard metrics."""
    total_projects: int
    active_projects: int
    total_tasks: int
    tasks_by_status: TasksByStatus
    tasks_by_priority: TasksByPriority
    overdue_tasks: int
    my_tasks_count: int


class TasksByAssignee(BaseModel):
    """Schema for tasks count by assignee."""
    user_id: UUID
    user_name: str
    count: int


class ProjectMetrics(BaseModel):
    """Schema for project-specific metrics."""
    total_tasks: int
    completed_tasks: int
    completion_percentage: float
    tasks_by_status: TasksByStatus
    tasks_by_assignee: list[TasksByAssignee]
