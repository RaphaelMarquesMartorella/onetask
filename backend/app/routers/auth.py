from fastapi import APIRouter, status

from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    AuthResponse,
    TokenRefresh,
)
from app.services.auth import AuthService
from app.utils.dependencies import CurrentUser, DbSession

router = APIRouter(prefix="/api/auth", tags=["Autenticação"])


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar novo usuário",
    description="Cria um novo usuário no sistema e retorna os tokens de acesso.",
)
async def register(user_data: UserCreate, db: DbSession):
    """Register a new user."""
    auth_service = AuthService(db)
    return await auth_service.register(user_data)


@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Login do usuário",
    description="Autentica o usuário e retorna os tokens de acesso.",
)
async def login(credentials: UserLogin, db: DbSession):
    """Authenticate a user."""
    auth_service = AuthService(db)
    return await auth_service.login(credentials)


@router.post(
    "/refresh",
    response_model=dict,
    summary="Atualizar token de acesso",
    description="Gera um novo token de acesso usando o refresh token.",
)
async def refresh_token(token_data: TokenRefresh, db: DbSession):
    """Refresh the access token."""
    auth_service = AuthService(db)
    return await auth_service.refresh_token(token_data.refresh_token)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Dados do usuário atual",
    description="Retorna os dados do usuário autenticado.",
)
async def get_current_user_info(current_user: CurrentUser):
    """Get current user information."""
    return current_user
