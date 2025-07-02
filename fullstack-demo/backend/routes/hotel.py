from bson import ObjectId
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import date
from models.hotel import Hotel
from models.room import Room
from pymongo.errors import DuplicateKeyError

router = APIRouter()

class HotelUpdate(BaseModel):
    name: Optional[str] = Field(default=None)
    email: Optional[EmailStr] = Field(default=None)
    password: Optional[str] = Field(default=None)
    date_of_birth: Optional[date] = Field(default=None)
    gender: Optional[str] = Field(default=None, min_length=1, max_length=1)

# Create Hotel
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_hotel(hotel: Hotel):
    try:
        await hotel.insert()
        return { "hotel": hotel.model_dump(mode="json") }
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Room number already exists in this hotel")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get Hotels of an admin
@router.get("/hotelAdmin/{hotel_admin_id}", response_model=List[Hotel])
async def get_hotels(hotel_admin_id: str):
    try:
        return await Hotel.find(Hotel.hotel_admin_id == hotel_admin_id).to_list()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get All Hotels
@router.get("/", response_model=List[Hotel])
async def get_all_hotels():
    try:
        return await Hotel.find_all().to_list()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get Single Hotel
@router.get("/{hotel_id}", response_model=Hotel)
async def get_hotel(hotel_id: str):
    try:
        hotel = await Hotel.get(hotel_id)
        if not hotel:
            raise HTTPException(status_code=404, detail="Hotel not found")
        return hotel
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Update a Hotel
@router.patch("/{hotel_id}", response_model=Hotel)
async def update_hotel(hotel_id: str, hotel_update: HotelUpdate):
    try:
        hotel_data = hotel_update.model_dump(exclude_unset=True)
        hotel_oid = ObjectId(hotel_id)

        updated_hotel = await Hotel.find_one(Hotel.id == hotel_oid).update(
            {"$set": hotel_data},
            response_type=Hotel
        )

        if not updated_hotel:
            raise HTTPException(status_code=404, detail="Hotel not found")

        return updated_hotel

    except HTTPException as e:
        raise e    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
# Delete a Hotel
@router.delete("/{hotel_id}", response_model=Hotel)
async def delete_hotel(hotel_id: str):
    try:
        hotel = await Hotel.get(hotel_id)
        if not hotel:
            raise HTTPException(status_code=404, detail="Hotel not found")
        
        # get and delete all rooms for this hotel first
        await Room.find(Room.hotel_id == hotel_id).delete()

        await hotel.delete()
        return hotel
    except HTTPException as e:
        raise e    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
