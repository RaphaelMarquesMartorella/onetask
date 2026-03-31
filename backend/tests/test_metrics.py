import pytest
from httpx import AsyncClient
from uuid import uuid4
from datetime import datetime, timezone, date, timedelta

from app.models import User, Project, Task
from app.models.task import TaskStatus, TaskPriority
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.mark.asyncio
async def test_dashboard_metrics(
    client: AsyncClient, auth_headers: dict, db_session: AsyncSession, test_user: User, test_project: Project
):
    """Test dashboard metrics endpoint returns correct data."""
    # Create tasks with different statuses and priorities
    tasks = [
        Task(
            id=uuid4(),
            project_id=test_project.id,
            title="Task Todo",
            status=TaskStatus.TODO,
            priority=TaskPriority.HIGH,
            created_by=test_user.id,
            created_at=datetime.now(timezone.utc).replace(tzinfo=None),
            updated_at=datetime.now(timezone.utc).replace(tzinfo=None),
        ),
        Task(
            id=uuid4(),
            project_id=test_project.id,
            title="Task In Progress",
            status=TaskStatus.IN_PROGRESS,
            priority=TaskPriority.MEDIUM,
            created_by=test_user.id,
            created_at=datetime.now(timezone.utc).replace(tzinfo=None),
            updated_at=datetime.now(timezone.utc).replace(tzinfo=None),
        ),
        Task(
            id=uuid4(),
            project_id=test_project.id,
            title="Task Done",
            status=TaskStatus.DONE,
            priority=TaskPriority.LOW,
            created_by=test_user.id,
            created_at=datetime.now(timezone.utc).replace(tzinfo=None),
            updated_at=datetime.now(timezone.utc).replace(tzinfo=None),
        ),
    ]
    for task in tasks:
        db_session.add(task)
    await db_session.commit()

    response = await client.get("/api/metrics/dashboard", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert "total_projects" in data
    assert "total_tasks" in data
    assert "tasks_by_status" in data
    assert "tasks_by_priority" in data
    assert data["total_projects"] >= 1
    assert data["total_tasks"] >= 3


@pytest.mark.asyncio
async def test_dashboard_metrics_overdue_tasks(
    client: AsyncClient, auth_headers: dict, db_session: AsyncSession, test_user: User, test_project: Project
):
    """Test dashboard metrics correctly identifies overdue tasks."""
    # Create an overdue task
    overdue_task = Task(
        id=uuid4(),
        project_id=test_project.id,
        title="Overdue Task",
        status=TaskStatus.TODO,
        priority=TaskPriority.HIGH,
        due_date=date.today() - timedelta(days=5),
        created_by=test_user.id,
        created_at=datetime.now(timezone.utc).replace(tzinfo=None),
        updated_at=datetime.now(timezone.utc).replace(tzinfo=None),
    )
    db_session.add(overdue_task)
    await db_session.commit()

    response = await client.get("/api/metrics/dashboard", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert "overdue_tasks" in data
    assert data["overdue_tasks"] >= 1


@pytest.mark.asyncio
async def test_project_metrics(
    client: AsyncClient, auth_headers: dict, db_session: AsyncSession, test_user: User, test_project: Project
):
    """Test project-specific metrics endpoint."""
    # Create tasks for the project
    tasks = [
        Task(
            id=uuid4(),
            project_id=test_project.id,
            title="Task 1",
            status=TaskStatus.DONE,
            priority=TaskPriority.HIGH,
            created_by=test_user.id,
            created_at=datetime.now(timezone.utc).replace(tzinfo=None),
            updated_at=datetime.now(timezone.utc).replace(tzinfo=None),
        ),
        Task(
            id=uuid4(),
            project_id=test_project.id,
            title="Task 2",
            status=TaskStatus.TODO,
            priority=TaskPriority.MEDIUM,
            created_by=test_user.id,
            created_at=datetime.now(timezone.utc).replace(tzinfo=None),
            updated_at=datetime.now(timezone.utc).replace(tzinfo=None),
        ),
    ]
    for task in tasks:
        db_session.add(task)
    await db_session.commit()

    response = await client.get(
        f"/api/metrics/projects/{test_project.id}", headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()

    assert "total_tasks" in data
    assert "completed_tasks" in data
    assert "tasks_by_status" in data
    assert data["total_tasks"] == 2
    assert data["completed_tasks"] == 1


@pytest.mark.asyncio
async def test_dashboard_metrics_unauthorized(client: AsyncClient):
    """Test dashboard metrics requires authentication."""
    response = await client.get("/api/metrics/dashboard")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_project_metrics_not_found(client: AsyncClient, auth_headers: dict):
    """Test project metrics with non-existent project."""
    fake_id = uuid4()
    response = await client.get(
        f"/api/metrics/projects/{fake_id}", headers=auth_headers
    )
    assert response.status_code == 404
