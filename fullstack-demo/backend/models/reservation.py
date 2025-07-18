from beanie import Document
from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional

from enums import ReservationStatus
from models.hotel import Hotel
from models.room import Room
from models.user import User

class Reservation(Document):
    start_date: date
    end_date: date

    user_id: str
    hotel_id: str
    room_id: str

    user: Optional[User] = Field(default=None)
    hotel: Optional[Hotel] = Field(default=None)
    room: Optional[Room] = Field(default=None)

    status: ReservationStatus

    # function that returns object with virtuals
    async def custom_model_dump(self, **kwargs) -> dict:
        base = self.model_dump(**kwargs)

        # serialize ObjectIds
        base["id"] = str(self.id)
        base["user_id"] = str(self.user_id)
        base["room_id"] = str(self.room_id)
        base["hotel_id"] = str(self.hotel_id)

        if self.user: base["user"] = await self.user.custom_model_dump()
        else: base.pop("user", None)
        if self.hotel: base["hotel"] = await self.hotel.custom_model_dump()
        else: base.pop("hotel", None)
        if self.room: base["room"] = await self.room.custom_model_dump() 
        else: base.pop("room", None)

        return base

    class Settings:
        name = "reservations"
        indexes = [
            [("room_id", 1), ("start_date", 1), ("end_date", 1)],
            [("hotel_id", 1)],
            [("user_id", 1)],
        ]

class ReservationResponse(BaseModel):
    id: str
    start_date: date
    end_date: date
    user_id: str
    hotel_id: str
    room_id: str
    status: ReservationStatus
    user: Optional[dict] = None
    hotel: Optional[dict] = None
    room: Optional[dict] = None

class ReservationCreate(BaseModel):
    start_date: date
    end_date: date
    user_id: str
    hotel_id: str
    room_id: str
    status: ReservationStatus

class GroupedReservations(BaseModel):
    past: List[dict]
    ongoing: List[dict]
    future: List[dict]
