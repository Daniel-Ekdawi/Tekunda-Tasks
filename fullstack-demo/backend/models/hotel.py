from beanie import Document, Indexed
from pydantic import Field, EmailStr, constr
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
    hotel_admin: Optional[User] = Field(default=None )
    
    rooms: List[Room] = []

    class Settings:
        name = "hotels"