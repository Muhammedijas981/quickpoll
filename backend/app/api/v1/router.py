from fastapi import APIRouter
from app.api.v1.endpoints import polls, websocket

api_router = APIRouter()

# Include poll endpoints
api_router.include_router(
    polls.router,
    prefix="/polls",
    tags=["polls"]
)

# Include WebSocket endpoint
api_router.include_router(
    websocket.router,
    tags=["websocket"]
)
