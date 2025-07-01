from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models.user import User

async def init_db():
    # CONNECTION_URI = "mongodb+srv://dekdawi:FT6p63aGqPlZ9hVm@tekunda-cluster.cdzkxhg.mongodb.net/?retryWrites=true&w=majority&appName=Tekunda-Cluster"
    CONNECTION_URI = "mongodb://dekdawi:FT6p63aGqPlZ9hVm@ac-byrikou-shard-00-00.cdzkxhg.mongodb.net:27017,ac-byrikou-shard-00-01.cdzkxhg.mongodb.net:27017,ac-byrikou-shard-00-02.cdzkxhg.mongodb.net:27017/?ssl=true&replicaSet=atlas-qe9vwl-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Tekunda-Cluster"
    client = AsyncIOMotorClient(CONNECTION_URI)
    db = client["testdb"]
    await init_beanie(database=db, document_models=[User])
    print("Database connected!")
