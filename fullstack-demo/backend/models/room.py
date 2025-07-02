from typing import Optional
from beanie import Document
from pydantic import Field
from pymongo import IndexModel

from lib.enums import RoomType

class Room(Document):
    number: str
    price: float
    description: str
    type: RoomType

    hotel_id: Optional[str] = Field(default=None)
    
    class Settings:
        name = "rooms"
        indexes = [
            IndexModel([("hotel_id", 1), ("number", 1)], unique=True)
        ]