from passlib.context import CryptContext
from fastapi import Depends

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def hide_password(user):
    user_dict = user.dict()
    user_dict.pop("hashed_password", None)
    return user_dict
