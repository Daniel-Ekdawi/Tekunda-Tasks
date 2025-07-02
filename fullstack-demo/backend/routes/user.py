from bson import ObjectId
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional, Annotated
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, constr, Field
from datetime import date, timedelta
from pymongo.errors import DuplicateKeyError
from models.user import User
from lib.hashing_password import verify_password, hide_password, hash_password
from lib.jwt_handler import create_access_token

router = APIRouter()

class UserUpdate(BaseModel):
    username: Optional[str] = Field(default=None)
    email: Optional[EmailStr] = Field(default=None)
    password: Optional[str] = Field(default=None)
    date_of_birth: Optional[date] = Field(default=None)
    gender: Optional[str] = Field(default=None, min_length=1, max_length=1)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

def create_response_with_token(user, status_code = 200):
    token = create_access_token({"sub": str(user.id)}, expires_delta=timedelta(minutes=60))
    response = JSONResponse(content={"user": user.model_dump(exclude={"password"}, mode="json")}, status_code=status_code)
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        max_age=60 * 60,  # 60 mins
        samesite="none", # "lax" if same site
        secure=True  # using https or not
    )
    return response

# Create User
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(user: User):
    try:
        hashed_pwd = hash_password(user.password)
        user.password = hashed_pwd
        await user.insert()
        return create_response_with_token(user, status_code=201)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    


# Login
@router.post("/login")
async def login_user(login: LoginRequest):
    try:
        user = await User.find_one(User.email == login.email)
        if not user or not verify_password(login.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if not user.is_active:
            raise HTTPException(status_code=401, detail="User not active")

        return create_response_with_token(user)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Logout
@router.post("/logout")
async def logout():
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie(
        key="token",
        path="/",
        samesite="none",
        secure=True
    )
    return response

# Toggle active status of user
@router.post("/{user_id}/active")
async def toggle_user_active(user_id: str):
    try:
        user = await User.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.is_active = not user.is_active
        await user.save()
        return {"user_id": str(user.id), "is_active": user.is_active}    
    except HTTPException as e:
        raise e    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get All Users
@router.get("/", response_model=List[User])
async def get_users():
    try:
        return await User.find_all().to_list()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get Single User
@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str):
    try:
        user = await User.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Update a User
@router.patch("/{user_id}", response_model=User)
async def update_user(user_id: str, user_update: UserUpdate):
    try:
        user_data = user_update.model_dump(exclude_unset=True)
        user_oid = ObjectId(user_id)

        updated_user = await User.find_one(User.id == user_oid).update(
            {"$set": user_data},
            response_type=User
        )

        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")

        return updated_user

    except HTTPException as e:
        raise e    
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
    
# Delete a User
@router.delete("/{user_id}", response_model=User)
async def delete_user(user_id: str):
    try:
        user = await User.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        await user.delete()
        return user
    except HTTPException as e:
        raise e    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
