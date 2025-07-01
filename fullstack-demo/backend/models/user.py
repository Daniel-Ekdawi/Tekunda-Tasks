from beanie import Document, Indexed
from pydantic import Field, EmailStr, constr, model_validator
from datetime import date
from typing import Annotated

class User(Document):
    username: Annotated[str, Indexed(unique=True)]
    email: Annotated[EmailStr, Indexed(unique=True)]
    password: str = Field(..., exclude=True)
    date_of_birth: date
    gender: Annotated[str, constr(min_length=1, max_length=1)]
    is_active: bool
    mobile_number: Annotated[str, constr(min_length=10, max_length=15)]
    job: str
    role: str = "viewer" # viewer / hotel_admin / super_admin

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
    
    class Settings:
        name = "users"