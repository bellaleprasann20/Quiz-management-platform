from pydantic import BaseModel

class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    xp: int

    class Config:
        from_attributes = True