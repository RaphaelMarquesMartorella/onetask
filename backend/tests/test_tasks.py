import pytest
from httpx import AsyncClient

from app.models import Project


@pytest.mark.asyncio
async def test_create_task(client: AsyncClient, auth_headers, test_project: Project):
    """Test creating a task."""
    response = await client.post(
        "/api/tasks/",
        headers=auth_headers,
        json={
            "project_id": str(test_project.id),
            "title": "New Task",
            "description": "Task description",
            "priority": "high",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "New Task"
    assert data["status"] == "todo"
    assert data["priority"] == "high"


@pytest.mark.asyncio
async def test_list_tasks(client: AsyncClient, auth_headers, test_project: Project):
    """Test listing tasks."""
    # First create a task
    await client.post(
        "/api/tasks/",
        headers=auth_headers,
        json={
            "project_id": str(test_project.id),
            "title": "Test Task",
        },
    )

    response = await client.get("/api/tasks/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


@pytest.mark.asyncio
async def test_list_tasks_by_project(
    client: AsyncClient,
    auth_headers,
    test_project: Project,
):
    """Test listing tasks filtered by project."""
    await client.post(
        "/api/tasks/",
        headers=auth_headers,
        json={
            "project_id": str(test_project.id),
            "title": "Project Task",
        },
    )

    response = await client.get(
        f"/api/tasks/?project_id={test_project.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert all(task["project_id"] == str(test_project.id) for task in data)


@pytest.mark.asyncio
async def test_update_task(client: AsyncClient, auth_headers, test_project: Project):
    """Test updating a task."""
    # Create task
    create_response = await client.post(
        "/api/tasks/",
        headers=auth_headers,
        json={
            "project_id": str(test_project.id),
            "title": "Task to Update",
        },
    )
    task_id = create_response.json()["id"]

    # Update task
    response = await client.put(
        f"/api/tasks/{task_id}",
        headers=auth_headers,
        json={"title": "Updated Task Title", "priority": "high"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Task Title"
    assert data["priority"] == "high"


@pytest.mark.asyncio
async def test_update_task_status(
    client: AsyncClient,
    auth_headers,
    test_project: Project,
):
    """Test updating task status (Kanban drag-and-drop)."""
    # Create task
    create_response = await client.post(
        "/api/tasks/",
        headers=auth_headers,
        json={
            "project_id": str(test_project.id),
            "title": "Kanban Task",
        },
    )
    task_id = create_response.json()["id"]

    # Update status
    response = await client.patch(
        f"/api/tasks/{task_id}/status",
        headers=auth_headers,
        json={"status": "in_progress", "position": 1},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "in_progress"
    assert data["position"] == 1


@pytest.mark.asyncio
async def test_delete_task(client: AsyncClient, auth_headers, test_project: Project):
    """Test deleting a task."""
    # Create task
    create_response = await client.post(
        "/api/tasks/",
        headers=auth_headers,
        json={
            "project_id": str(test_project.id),
            "title": "Task to Delete",
        },
    )
    task_id = create_response.json()["id"]

    # Delete task
    response = await client.delete(
        f"/api/tasks/{task_id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Tarefa excluída com sucesso"

    # Verify deletion
    get_response = await client.get(
        f"/api/tasks/{task_id}",
        headers=auth_headers,
    )
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_create_task_nonexistent_project(client: AsyncClient, auth_headers):
    """Test creating a task in a non-existent project."""
    import uuid
    fake_id = uuid.uuid4()
    response = await client.post(
        "/api/tasks/",
        headers=auth_headers,
        json={
            "project_id": str(fake_id),
            "title": "Orphan Task",
        },
    )
    assert response.status_code == 404
