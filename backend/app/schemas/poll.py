from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class PollOptionResponse(BaseModel):
    id: str
    text: str
    votes: int = 0


class PollResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    options: List[PollOptionResponse]
    totalVotes: int = 0
    likes: int = 0
    createdAt: str


class CreatePollRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    options: List[str] = Field(..., min_length=2, max_length=10)
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "What's your favorite programming language?",
                "description": "Vote for your top choice",
                "options": ["Python", "JavaScript", "TypeScript", "Go"]
            }
        }


class VoteRequest(BaseModel):
    optionId: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "optionId": "123e4567-e89b-12d3-a456-426614174000"
            }
        }


class WebSocketMessage(BaseModel):
    type: str  # 'vote', 'like', 'new_poll'
    data: dict
