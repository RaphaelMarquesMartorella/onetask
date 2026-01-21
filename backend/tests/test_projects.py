import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_project(client: AsyncClient, auth_headers):
    """Test creating a project."""
    response = await client.post(
        "/api/projects/",
        headers=auth_headers,
        json={
            "name": "New Project",
            "description": "A new project description",
            "client_name": "Client ABC",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "New Project"
    assert data["status"] == "active"


@pytest.mark.asyncio
async def test_list_projects(client: AsyncClient, auth_headers, test_project):
    """Test listing projects."""
    response = await client.get("/api/projects/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 1


@pytest.mark.asyncio
async def test_get_project(client: AsyncClient, auth_headers, test_project):
    """Test getting a single project."""
    response = await client.get(
        f"/api/projects/{test_project.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Project"
    assert "tasks" in data


@pytest.mark.asyncio
async def test_update_project(client: AsyncClient, auth_headers, test_project):
    """Test updating a project."""
    response = await client.put(
        f"/api/projects/{test_project.id}",
        headers=auth_headers,
        json={"name": "Updated Project Name"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Project Name"


@pytest.mark.asyncio
async def test_archive_project(client: AsyncClient, auth_headers, test_project):
    """Test archiving a project."""
    response = await client.delete(
        f"/api/projects/{test_project.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Projeto arquivado com sucesso"


@pytest.mark.asyncio
async def test_get_nonexistent_project(client: AsyncClient, auth_headers):
    """Test getting a non-existent project."""
    import uuid
    fake_id = uuid.uuid4()
    response = await client.get(
        f"/api/projects/{fake_id}",
        headers=auth_headers,
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_projects_unauthorized(client: AsyncClient):
    """Test accessing projects without authentication."""
    response = await client.get("/api/projects/")
    assert response.status_code == 401
