from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.project import Project, ProjectStatus
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectRepository:
    """Repository for project database operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, project_id: UUID) -> Project | None:
        """Get a project by ID."""
        result = await self.db.execute(
            select(Project).where(Project.id == project_id)
        )
        return result.scalar_one_or_none()

    async def get_by_id_with_tasks(self, project_id: UUID) -> Project | None:
        """Get a project by ID with tasks loaded."""
        result = await self.db.execute(
            select(Project)
            .options(selectinload(Project.tasks))
            .where(Project.id == project_id)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 10,
        status: ProjectStatus | None = None,
        search: str | None = None,
    ) -> tuple[list[Project], int]:
        """Get all projects with pagination and filtering."""
        query = select(Project).where(Project.status != ProjectStatus.ARCHIVED)

        if status:
            query = query.where(Project.status == status)

        if search:
            search_filter = f"%{search}%"
            query = query.where(
                (Project.name.ilike(search_filter))
                | (Project.description.ilike(search_filter))
                | (Project.client_name.ilike(search_filter))
            )

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()

        # Get paginated results
        query = query.order_by(Project.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        projects = list(result.scalars().all())

        return projects, total

    async def create(self, project_data: ProjectCreate, created_by: UUID) -> Project:
        """Create a new project."""
        project = Project(
            name=project_data.name,
            description=project_data.description,
            client_name=project_data.client_name,
            start_date=project_data.start_date,
            due_date=project_data.due_date,
            created_by=created_by,
        )
        self.db.add(project)
        await self.db.commit()
        await self.db.refresh(project)
        return project

    async def update(self, project: Project, project_data: ProjectUpdate) -> Project:
        """Update a project."""
        update_data = project_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(project, field, value)

        await self.db.commit()
        await self.db.refresh(project)
        return project

    async def archive(self, project: Project) -> Project:
        """Archive a project (soft delete)."""
        project.status = ProjectStatus.ARCHIVED
        await self.db.commit()
        await self.db.refresh(project)
        return project
