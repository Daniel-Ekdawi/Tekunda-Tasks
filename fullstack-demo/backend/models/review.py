from beanie import Document
from pydantic import Field, constr, model_validator
from datetime import datetime
from typing import Annotated, Optional, Literal

class Review(Document):
    user_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: Annotated[str, constr(min_length=1)]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Target reference
    hotel_id: Optional[str] = None
    room_id: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def validate_target(cls, data):
        if bool(data.get("hotel_id")) == bool(data.get("room_id")):
            raise ValueError("A review must be linked to either a hotel or a room, not both or neither.")
        return data
    
    # function that returns object with virtuals
    async def custom_model_dump(self, **kwargs) -> dict:
        base = self.model_dump(**kwargs)

        # serialize ObjectIds
        base["id"] = str(self.id)
        base["user_id"] = str(self.user_id)

        if base["hotel_id"]: base["hotel_id"] = str(self.hotel_id)
        if base["room_id"]: base["room_id"] = str(self.room_id)

        return base

    class Settings:
        name = "reviews"