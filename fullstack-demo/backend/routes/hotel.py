from bson import ObjectId
from fastapi import APIRouter, Body, HTTPException, status
from typing import List
from models.hotel import Hotel, HotelResponse, HotelUpdate
from models.room import Room
from pymongo.errors import DuplicateKeyError

from models.user import User

router = APIRouter()
    
# Create Hotel
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=HotelResponse)
async def create_hotel(hotel: Hotel):
    try:
        await hotel.insert()
        return await hotel.custom_model_dump(mode="json")
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Hotel name already exists in this hotel")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get Hotels of an admin
@router.get("/hotelAdmin/{hotel_admin_id}", response_model=List[HotelResponse])
async def get_hotels(hotel_admin_id: str):
    try:
        hotels = await Hotel.find(Hotel.hotel_admin_id == hotel_admin_id).to_list()
        populated_hotels = []
        
        for hotel in hotels:
            admin = await User.get(hotel.hotel_admin_id)
            if not admin:
                continue

            hotel_dict = await hotel.custom_model_dump(mode="json")
            hotel_dict["hotel_admin"] = await admin.custom_model_dump()
            populated_hotels.append(hotel_dict)

        return populated_hotels
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get Hotel IDs of an admin
@router.get("/hotelAdmin/{hotel_admin_id}/id", response_model=List[dict])
async def get_hotel_ids(hotel_admin_id: str):
    try:
        col = Hotel.get_motor_collection()
        docs = await col.find(
            {"hotel_admin_id": hotel_admin_id},
            {"_id": 1, "name": 1},
        ).to_list(length=None)

        return [{ "id": str(d["_id"]), "name": d["name"] } for d in docs]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get all Hotel IDs
@router.get("/id", response_model=List[dict])
async def get_all_hotel_ids():
    try:
        col = Hotel.get_motor_collection()
        docs = await col.find(
            { },
            {"_id": 1, "name": 1},
        ).to_list(length=None)

        return [{ "id": str(d["_id"]), "name": d["name"] } for d in docs]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))       

# Get All Hotels
@router.get("/", response_model=List[HotelResponse])
async def get_all_hotels():
    try:
        hotels = await Hotel.find_all().to_list()
        populated_hotels = []
        
        for hotel in hotels:
            admin = await User.get(hotel.hotel_admin_id)
            if not admin:
                continue
            
            hotel_dict = await hotel.custom_model_dump(mode="json")
            hotel_dict["hotel_admin"] = await admin.custom_model_dump()
            populated_hotels.append(hotel_dict)

        return populated_hotels
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get Single Hotel
@router.get("/{hotel_id}", response_model=HotelResponse)
async def get_hotel(hotel_id: str):
    try:
        hotel = await Hotel.get(hotel_id)
        if not hotel:
            raise HTTPException(status_code=404, detail="Hotel not found")
        return await hotel.custom_model_dump()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Update a Hotel
@router.patch("/{hotel_id}", response_model=HotelResponse)
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

        return await updated_hotel.custom_model_dump()

    except HTTPException as e:
        raise e    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
# Toggle a property of a hotel
@router.post("/{hotel_id}/toggle")
async def toggle_user_active(hotel_id: str, hotel_update_property: str = Body(...)):
    try:
        hotel = await Hotel.get(hotel_id)
        if not hotel:
            raise HTTPException(status_code=404, detail="Hotel not found")
                
        current_value = getattr(hotel, hotel_update_property, None)
        if not isinstance(current_value, bool):
            raise HTTPException(status_code=400, detail="Property must be a boolean to toggle")

        setattr(hotel, hotel_update_property, not current_value)
        await hotel.save()

        return {"hotel_id": str(hotel.id), hotel_update_property: getattr(hotel, hotel_update_property) }    
    except HTTPException as e:
        raise e    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
# Delete a Hotel
@router.delete("/{hotel_id}", response_model=HotelResponse)
async def delete_hotel(hotel_id: str):
    try:
        hotel = await Hotel.get(hotel_id)
        if not hotel:
            raise HTTPException(status_code=404, detail="Hotel not found")
        
        # get and delete all rooms for this hotel first
        await Room.find(Room.hotel_id == hotel_id).delete()

        await hotel.delete()
        return await hotel.custom_model_dump()
    except HTTPException as e:
        raise e    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
