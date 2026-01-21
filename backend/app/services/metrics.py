from datetime import date
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project, ProjectStatus
from app.models.task import Task, TaskStatus, TaskPriority
from app.models.user import User
from app.schemas.metrics import (
    DashboardMetrics,
    ProjectMetrics,
    TasksByStatus,
    TasksByPriority,
    TasksByAssignee,
)


class MetricsService:
    """Service for metrics and analytics."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_metrics(self, user_id: UUID) -> DashboardMetrics:
        """Get dashboard metrics."""
        # Total and active projects
        total_projects_result = await self.db.execute(
            select(func.count(Project.id)).where(Project.status != ProjectStatus.ARCHIVED)
        )
        total_projects = total_projects_result.scalar_one()

        active_projects_result = await self.db.execute(
            select(func.count(Project.id)).where(Project.status == ProjectStatus.ACTIVE)
        )
        active_projects = active_projects_result.scalar_one()

        # Total tasks
        total_tasks_result = await self.db.execute(select(func.count(Task.id)))
        total_tasks = total_tasks_result.scalar_one()

        # Tasks by status
        tasks_by_status = await self._get_tasks_by_status()

        # Tasks by priority
        tasks_by_priority = await self._get_tasks_by_priority()

        # Overdue tasks
        today = date.today()
        overdue_result = await self.db.execute(
            select(func.count(Task.id)).where(
                Task.due_date < today,
                Task.status != TaskStatus.DONE,
            )
        )
        overdue_tasks = overdue_result.scalar_one()

        # My tasks count
        my_tasks_result = await self.db.execute(
            select(func.count(Task.id)).where(Task.assignee_id == user_id)
        )
        my_tasks_count = my_tasks_result.scalar_one()

        return DashboardMetrics(
            total_projects=total_projects,
            active_projects=active_projects,
            total_tasks=total_tasks,
            tasks_by_status=tasks_by_status,
            tasks_by_priority=tasks_by_priority,
            overdue_tasks=overdue_tasks,
            my_tasks_count=my_tasks_count,
        )

    async def get_project_metrics(self, project_id: UUID) -> ProjectMetrics:
        """Get metrics for a specific project."""
        # Verify project exists
        project_result = await self.db.execute(
            select(Project).where(Project.id == project_id)
        )
        project = project_result.scalar_one_or_none()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Projeto não encontrado",
            )

        # Total tasks in project
        total_result = await self.db.execute(
            select(func.count(Task.id)).where(Task.project_id == project_id)
        )
        total_tasks = total_result.scalar_one()

        # Completed tasks
        completed_result = await self.db.execute(
            select(func.count(Task.id)).where(
                Task.project_id == project_id,
                Task.status == TaskStatus.DONE,
            )
        )
        completed_tasks = completed_result.scalar_one()

        # Completion percentage
        completion_percentage = (
            (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0.0
        )

        # Tasks by status for this project
        tasks_by_status = await self._get_tasks_by_status(project_id)

        # Tasks by assignee
        tasks_by_assignee = await self._get_tasks_by_assignee(project_id)

        return ProjectMetrics(
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            completion_percentage=round(completion_percentage, 2),
            tasks_by_status=tasks_by_status,
            tasks_by_assignee=tasks_by_assignee,
        )

    async def _get_tasks_by_status(
        self,
        project_id: UUID | None = None,
    ) -> TasksByStatus:
        """Get task count by status."""
        query = select(Task.status, func.count(Task.id)).group_by(Task.status)

        if project_id:
            query = query.where(Task.project_id == project_id)

        result = await self.db.execute(query)
        status_counts = {row[0]: row[1] for row in result.all()}

        return TasksByStatus(
            todo=status_counts.get(TaskStatus.TODO, 0),
            in_progress=status_counts.get(TaskStatus.IN_PROGRESS, 0),
            in_review=status_counts.get(TaskStatus.IN_REVIEW, 0),
            done=status_counts.get(TaskStatus.DONE, 0),
        )

    async def _get_tasks_by_priority(self) -> TasksByPriority:
        """Get task count by priority."""
        result = await self.db.execute(
            select(Task.priority, func.count(Task.id)).group_by(Task.priority)
        )
        priority_counts = {row[0]: row[1] for row in result.all()}

        return TasksByPriority(
            low=priority_counts.get(TaskPriority.LOW, 0),
            medium=priority_counts.get(TaskPriority.MEDIUM, 0),
            high=priority_counts.get(TaskPriority.HIGH, 0),
        )

    async def _get_tasks_by_assignee(self, project_id: UUID) -> list[TasksByAssignee]:
        """Get task count by assignee for a project."""
        result = await self.db.execute(
            select(
                Task.assignee_id,
                User.name,
                func.count(Task.id),
            )
            .join(User, Task.assignee_id == User.id)
            .where(Task.project_id == project_id, Task.assignee_id.isnot(None))
            .group_by(Task.assignee_id, User.name)
        )

        return [
            TasksByAssignee(user_id=row[0], user_name=row[1], count=row[2])
            for row in result.all()
        ]
