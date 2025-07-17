from beanie import Document, Indexed
from pydantic import BaseModel, Field, EmailStr, constr, model_validator
from datetime import date
from typing import Annotated, Optional

from lib.enums import UserRole

class User(Document):
    username: Annotated[str, Indexed(unique=True)]
    email: Annotated[EmailStr, Indexed(unique=True)]
    password: str = Field(..., exclude=True)
    date_of_birth: date
    gender: Annotated[str, constr(min_length=1, max_length=1)]
    is_active: bool
    phone_number: Annotated[str, constr(min_length=10, max_length=15)]
    job: str
    role: UserRole = UserRole.VIEWER

    @property
    def age(self) -> int:
        today = date.today()
        return (
            today.year
            - self.date_of_birth.year
            - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        )
    
    @model_validator(mode="before")
    @classmethod
    def set_is_active_from_role(cls, data):
        if "is_active" not in data:
            role = data.get("role", "viewer")
            data["is_active"] = role == "viewer"
        return data
    
    # function that returns object with virtuals
    async def custom_model_dump(self, **kwargs) -> dict:
        base = self.model_dump(**kwargs)

        # serialize ObjectIds
        base["id"] = str(self.id)
        base["age"] = str(self.age)

        return base

    class Settings:
        name = "users"

class UserUpdate(BaseModel):
    username: Optional[str] = Field(default=None)
    email: Optional[EmailStr] = Field(default=None)
    password: Optional[str] = Field(default=None)
    date_of_birth: Optional[date] = Field(default=None)
    gender: Optional[str] = Field(default=None, min_length=1, max_length=1)

class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    date_of_birth: date
    gender: str
    is_active: bool
    phone_number: str
    job: str
    role: UserRole
    age: int

    class Config:
        from_attributes = True 