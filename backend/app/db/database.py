from typing import Dict, List
from datetime import datetime
import uuid


class InMemoryDB:
    """Simple in-memory database for the assignment"""
    
    def __init__(self):
        self.polls: Dict[str, dict] = {}
        self.votes: Dict[str, List[dict]] = {}  # pollId -> list of votes
        self.likes: Dict[str, int] = {}  # pollId -> like count
    
    def create_poll(self, poll_data: dict) -> dict:
        poll_id = str(uuid.uuid4())
        poll = {
            "id": poll_id,
            "title": poll_data["title"],
            "description": poll_data.get("description"),
            "options": [
                {
                    "id": str(uuid.uuid4()),
                    "text": option,
                    "votes": 0
                }
                for option in poll_data["options"]
            ],
            "totalVotes": 0,
            "likes": 0,
            "createdAt": datetime.utcnow().isoformat(),
        }
        self.polls[poll_id] = poll
        self.votes[poll_id] = []
        self.likes[poll_id] = 0
        return poll
    
    def get_poll(self, poll_id: str) -> dict:
        return self.polls.get(poll_id)
    
    def get_all_polls(self) -> List[dict]:
        return list(self.polls.values())
    
    def vote_on_poll(self, poll_id: str, option_id: str) -> dict:
        poll = self.polls.get(poll_id)
        if not poll:
            return None
        
        # Update option votes
        for option in poll["options"]:
            if option["id"] == option_id:
                option["votes"] += 1
                poll["totalVotes"] += 1
                break
        
        # Store vote
        vote = {
            "pollId": poll_id,
            "optionId": option_id,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.votes[poll_id].append(vote)
        
        return poll
    
    def like_poll(self, poll_id: str) -> dict:
        poll = self.polls.get(poll_id)
        if not poll:
            return None
        
        poll["likes"] += 1
        self.likes[poll_id] = poll["likes"]
        
        return poll


# Global database instance
db = InMemoryDB()
