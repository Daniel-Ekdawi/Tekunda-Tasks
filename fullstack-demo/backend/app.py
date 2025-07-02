from fastapi import FastAPI
from db import init_db
from routes.auth import router as auth_router
from routes.user import router as user_router
from routes.hotel import router as hotel_router
from routes.room import router as room_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # allow_origins=["*"] to allow everything
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def start_db():
    await init_db()

app.include_router(auth_router, prefix="/auth")
app.include_router(user_router, prefix="/user")
app.include_router(hotel_router, prefix="/hotel")
app.include_router(room_router, prefix="/hotel")