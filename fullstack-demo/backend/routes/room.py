from bson import ObjectId
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import date
from models.hotel import Hotel
from models.room import Room
from pymongo.errors import DuplicateKeyError

router = APIRouter()

class RoomUpdate(BaseModel):
    number: Optional[str] = Field(default=None)
    price: Optional[EmailStr] = Field(default=None)
    description: Optional[str] = Field(default=None)
    type: Optional[date] = Field(default=None)

# Create Room
@router.post("/{hotel_id}/room", status_code=status.HTTP_201_CREATED)
async def create_hotel(room: Room, hotel_id: str):
    try:
        # first check if hotel exists
        hotel = await Hotel.get(hotel_id)
        if not hotel:
            raise HTTPException(status_code=404, detail="Hotel not found")
        
        room.hotel_id = hotel_id
        await room.insert()
        return { "room": room.model_dump(mode="json") }
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Room number already exists in this hotel")
    except HTTPException as e:
        raise e 
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get Rooms for a single hotel
@router.get("/{hotel_id}/room", response_model=List[Room])
async def get_room(hotel_id: str):
    try:
        return await Room.find(Room.hotel_id == hotel_id).to_list()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get All Rooms
@router.get("/room/all", response_model=List[Room])
async def get_all_rooms():
    try:
        return await Room.find_all().to_list()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get Single Room
@router.get("/{hotel_id}/room/{room_id}", response_model=Room)
async def get_room(hotel_id: str, room_id: str):
    try:
        room = await Room.get(room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        if not room.hotel_id == hotel_id:
            raise HTTPException(status_code=404, detail="Room not found in this hotel")
        return room
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Update a Room
@router.patch("/{hotel_id}/room/{room_id}", response_model=Room)
async def update_room(hotel_id: str, room_id: str, room_update: RoomUpdate):
    try:
        room_data = room_update.model_dump(exclude_unset=True)
        room_oid = ObjectId(room_id)

        updated_room = await Room.find_one(Room.id == room_oid)

        if not updated_room:
            raise HTTPException(status_code=404, detail="Room not found")

        if not updated_room.hotel_id == hotel_id:
            raise HTTPException(status_code=404, detail="Room not found in this hotel")

        updated_room = await Room.find_one(Room.id == room_oid).update(
            {"$set": room_data},
            response_type=Room
        )

        return updated_room
    except HTTPException as e:
        raise e    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
# Delete a Room
@router.delete("/{hotel_id}/room/{room_id}", response_model=Room)
async def delete_hotel(hotel_id: str, room_id):
    try:
        room = await Room.get(room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        if not room.hotel_id == hotel_id:
            raise HTTPException(status_code=404, detail="Room not found in this hotel")
        
        await room.delete()
        return room
    except HTTPException as e:
        raise e    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
