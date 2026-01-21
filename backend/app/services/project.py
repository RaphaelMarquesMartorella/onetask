from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import ProjectStatus
from app.models.user import User
from app.repositories.project import ProjectRepository
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectDetailResponse,
    ProjectListResponse,
)
from app.schemas.task import TaskResponse


class ProjectService:
    """Service for project operations."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.project_repo = ProjectRepository(db)

    async def get_all(
        self,
        page: int = 1,
        limit: int = 10,
        status: ProjectStatus | None = None,
        search: str | None = None,
    ) -> ProjectListResponse:
        """Get all projects with pagination."""
        skip = (page - 1) * limit
        projects, total = await self.project_repo.get_all(
            skip=skip,
            limit=limit,
            status=status,
            search=search,
        )

        return ProjectListResponse(
            items=[ProjectResponse.model_validate(p) for p in projects],
            total=total,
            page=page,
            limit=limit,
        )

    async def get_by_id(self, project_id: UUID) -> ProjectDetailResponse:
        """Get a project by ID with tasks."""
        project = await self.project_repo.get_by_id_with_tasks(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Projeto não encontrado",
            )

        return ProjectDetailResponse(
            id=project.id,
            name=project.name,
            description=project.description,
            client_name=project.client_name,
            status=project.status,
            start_date=project.start_date,
            due_date=project.due_date,
            created_by=project.created_by,
            created_at=project.created_at,
            updated_at=project.updated_at,
            tasks=[TaskResponse.model_validate(t) for t in project.tasks],
        )

    async def create(self, project_data: ProjectCreate, current_user: User) -> ProjectResponse:
        """Create a new project."""
        project = await self.project_repo.create(project_data, current_user.id)
        return ProjectResponse.model_validate(project)

    async def update(
        self,
        project_id: UUID,
        project_data: ProjectUpdate,
    ) -> ProjectResponse:
        """Update a project."""
        project = await self.project_repo.get_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Projeto não encontrado",
            )

        updated_project = await self.project_repo.update(project, project_data)
        return ProjectResponse.model_validate(updated_project)

    async def archive(self, project_id: UUID) -> dict[str, str]:
        """Archive a project (soft delete)."""
        project = await self.project_repo.get_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Projeto não encontrado",
            )

        await self.project_repo.archive(project)
        return {"message": "Projeto arquivado com sucesso"}
