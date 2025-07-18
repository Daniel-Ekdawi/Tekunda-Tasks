from typing import Dict, List, Optional
from beanie import Document
from pydantic import BaseModel, Field, RootModel
from pymongo import IndexModel

from enums import RoomType

class Room(Document):
    number: str
    price: float
    description: str
    type: RoomType

    hotel_id: Optional[str] = Field(default=None)

    # function that returns object with virtuals
    async def custom_model_dump(self, **kwargs) -> dict:
        base = self.model_dump(**kwargs)

        # serialize ObjectIds
        base["id"] = str(self.id)

        return base

    class Settings:
        name = "rooms"
        indexes = [
            IndexModel([("hotel_id", 1), ("number", 1)], unique=True)
        ]

class RoomUpdate(BaseModel):
    number: Optional[str] = Field(default=None)
    price: Optional[float] = Field(default=None)
    description: Optional[str] = Field(default=None)
    type: Optional[RoomType] = Field(default=None)


class RoomResponse(BaseModel):
    id: str
    number: str
    price: float
    description: str
    type: RoomType
    hotel_id: Optional[str]

    class Config:
        from_attributes = True

class RoomsGroupedByHotelResponse(RootModel[Dict[str, List[RoomResponse]]]):
    pass