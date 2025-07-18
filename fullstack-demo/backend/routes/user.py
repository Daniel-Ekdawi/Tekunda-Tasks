from bson import ObjectId
from fastapi import APIRouter, HTTPException
from typing import List
from pymongo.errors import DuplicateKeyError
from models.user import User, UserResponse, UserUpdate

router = APIRouter()

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
@router.get("/", response_model=List[UserResponse])
async def get_users():
    try:
        users = await User.find_all().to_list()
        return [await user.custom_model_dump() for user in users]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get Single User
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    try:
        user = await User.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return await user.custom_model_dump()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Update a User
@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_update: UserUpdate):
    try:
        user_data = user_update.model_dump(exclude_unset=True, exclude_none=True)
        if not user_data:
            raise HTTPException(status_code=400, detail="No fields provided")
    
        try:
            user_oid = ObjectId(user_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        updated_user = await User.find_one(User.id == user_oid).update(
            {"$set": user_data},
            response_type=User
        )

        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")

        return await updated_user.custom_model_dump()
    except HTTPException as e:
        raise e    
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
    
# Delete a User
@router.delete("/{user_id}", response_model=UserResponse)
async def delete_user(user_id: str):
    try:
        user = await User.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        await user.delete()
        return await user.custom_model_dump()
    except HTTPException as e:
        raise e    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
