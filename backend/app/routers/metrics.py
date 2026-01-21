from uuid import UUID

from fastapi import APIRouter

from app.schemas.metrics import DashboardMetrics, ProjectMetrics
from app.services.metrics import MetricsService
from app.utils.dependencies import CurrentUser, DbSession

router = APIRouter(prefix="/api/metrics", tags=["Métricas"])


@router.get(
    "/dashboard",
    response_model=DashboardMetrics,
    summary="Métricas do dashboard",
    description="Retorna métricas gerais para o dashboard.",
)
async def get_dashboard_metrics(
    db: DbSession,
    current_user: CurrentUser,
):
    """Get dashboard metrics."""
    metrics_service = MetricsService(db)
    return await metrics_service.get_dashboard_metrics(current_user.id)


@router.get(
    "/projects/{project_id}",
    response_model=ProjectMetrics,
    summary="Métricas do projeto",
    description="Retorna métricas específicas de um projeto.",
)
async def get_project_metrics(
    project_id: UUID,
    db: DbSession,
    current_user: CurrentUser,
):
    """Get project-specific metrics."""
    metrics_service = MetricsService(db)
    return await metrics_service.get_project_metrics(project_id)
