from fastapi import APIRouter, HTTPException, status
from typing import List

from app.schemas.poll import (
    CreatePollRequest,
    PollResponse,
    VoteRequest,
)
from app.db.database import db
from app.core.websocket_manager import manager

router = APIRouter()


@router.get("/", response_model=List[PollResponse])
async def get_polls():
    """Get all polls"""
    polls = db.get_all_polls()
    return polls


@router.get("/{poll_id}", response_model=PollResponse)
async def get_poll(poll_id: str):
    """Get a specific poll by ID"""
    poll = db.get_poll(poll_id)
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Poll not found"
        )
    return poll


@router.post("/", response_model=PollResponse, status_code=status.HTTP_201_CREATED)
async def create_poll(poll_data: CreatePollRequest):
    """Create a new poll"""
    # Validate options
    if len(poll_data.options) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Poll must have at least 2 options"
        )
    
    # Create poll
    poll = db.create_poll(poll_data.model_dump())
    
    # Broadcast new poll to all connected clients
    await manager.broadcast({
        "type": "new_poll",
        "data": {"poll": poll}
    })
    
    return poll


@router.post("/{poll_id}/vote", response_model=PollResponse)
async def vote_on_poll(poll_id: str, vote_data: VoteRequest):
    """Vote on a poll"""
    poll = db.get_poll(poll_id)
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Poll not found"
        )
    
    # Check if option exists
    option_exists = any(opt["id"] == vote_data.optionId for opt in poll["options"])
    if not option_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid option ID"
        )
    
    # Record vote
    updated_poll = db.vote_on_poll(poll_id, vote_data.optionId)
    
    # Broadcast vote to all connected clients - ONLY send IDs, not full poll
    await manager.broadcast({
        "type": "vote",
        "data": {
            "pollId": poll_id,
            "optionId": vote_data.optionId
        }
    })
    
    return updated_poll

@router.post("/{poll_id}/like", response_model=PollResponse)
async def like_poll(poll_id: str):
    """Like a poll"""
    poll = db.get_poll(poll_id)
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Poll not found"
        )
    
    # Record like
    updated_poll = db.like_poll(poll_id)
    
    # Broadcast like to all connected clients - ONLY send ID
    await manager.broadcast({
        "type": "like",
        "data": {
            "pollId": poll_id
            # ← Removed "poll" field
        }
    })
    
    return updated_poll
    """Like a poll"""
    poll = db.get_poll(poll_id)
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Poll not found"
        )
    
    # Record like
    updated_poll = db.like_poll(poll_id)
    
    # Broadcast like to all connected clients
    await manager.broadcast({
        "type": "like",
        "data": {
            "pollId": poll_id,
            "poll": updated_poll
        }
    })
    
    return updated_poll
