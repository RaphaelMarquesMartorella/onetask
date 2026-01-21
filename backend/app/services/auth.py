from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserLogin, AuthResponse, UserResponse
from app.utils.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)


class AuthService:
    """Service for authentication operations."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def register(self, user_data: UserCreate) -> AuthResponse:
        """Register a new user."""
        existing_user = await self.user_repo.get_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já está em uso",
            )

        user = await self.user_repo.create(user_data)
        tokens = self._create_tokens(user)

        return AuthResponse(
            user=UserResponse.model_validate(user),
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
        )

    async def login(self, credentials: UserLogin) -> AuthResponse:
        """Authenticate a user and return tokens."""
        user = await self.user_repo.get_by_email(credentials.email)
        if not user or not verify_password(credentials.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciais inválidas",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário inativo",
            )

        tokens = self._create_tokens(user)

        return AuthResponse(
            user=UserResponse.model_validate(user),
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
        )

    async def refresh_token(self, refresh_token: str) -> dict[str, str]:
        """Refresh the access token using a refresh token."""
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido ou expirado",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
            )

        user = await self.user_repo.get_by_id(UUID(user_id))
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário não encontrado ou inativo",
            )

        access_token = create_access_token(data={"sub": str(user.id)})
        return {"access_token": access_token}

    async def get_current_user(self, user_id: UUID) -> User:
        """Get the current authenticated user."""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado",
            )
        return user

    def _create_tokens(self, user: User) -> dict[str, str]:
        """Create access and refresh tokens for a user."""
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
