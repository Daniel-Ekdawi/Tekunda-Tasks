from beanie import Document, Indexed
from pydantic import BaseModel, Field, EmailStr, constr
from typing import Annotated, List, Optional
from models.room import Room
from models.user import User

class Hotel(Document):
    name: Annotated[str, Indexed(unique=True)]
    phone_number: Annotated[str, constr(min_length=10, max_length=15)]
    email: EmailStr
    images: List[str] = Field(default_factory=list)

    gym: bool = False
    spa: bool = False
    wifi: bool = False
    parking: bool = False

    swimming_pools: int = 0
    max_reservations: int = 0

    hotel_admin_id: str
    hotel_admin: Optional[User] = Field(default=None)
    
    @property
    async def number_of_rooms(self) -> int:
        return await Room.find({"hotel_id": str(self.id)}).count()

    # function that returns object with virtuals
    async def custom_model_dump(self, **kwargs) -> dict:
        base = self.model_dump(**kwargs)

        # serialize ObjectIds
        base["id"] = str(self.id)
        base["hotel_admin_id"] = str(self.hotel_admin_id)

        # virtual fields
        base["number_of_rooms"] = await self.number_of_rooms

        return base

    class Settings:
        name = "hotels"

class HotelResponse(BaseModel):
    id: str
    name: str
    phone_number: str
    email: EmailStr
    images: List[str]
    gym: bool
    spa: bool
    wifi: bool
    parking: bool
    swimming_pools: int
    max_reservations: int
    hotel_admin_id: str
    hotel_admin: Optional[dict]
    number_of_rooms: int

    class Config:
        from_attributes = True

class HotelUpdate(BaseModel):
    name: Optional[str] = Field(default=None)
    phone_number: Optional[str] = Field(default=None, min_length=10, max_length=15)
    email: Optional[EmailStr] = Field(default=None)
    swimming_pools: Optional[int] = Field(default=None, ge=0)
    max_reservations: Optional[int] = Field(default=None, ge=0)
    gym: Optional[bool] = Field(default=None)
    spa: Optional[bool] = Field(default=None)
    wifi: Optional[bool] = Field(default=None)
    parking: Optional[bool] = Field(default=None)