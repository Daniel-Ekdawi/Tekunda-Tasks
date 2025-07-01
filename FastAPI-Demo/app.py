from fastapi import FastAPI

app = FastAPI()

# Dummy users
users = [
    {
        "id": 1,
        "name": "Daniel Ekdawi",
        "age": 22
    },
    {
        "id": 2,
        "name": "Michel Ekdawi",
        "age": 29
    },
    {
        "id": 3,
        "name": "Michael Weesa",
        "age": 22
    }
]

@app.get("/")
def home():
    return {"message": "Welcome to the home page of our app!"}

@app.get("/greet/{id}")
def greet(id: int):
    name = next((user["name"] for user in users if user["id"] == id), None)
    if name is None:
        return {"message": "User is not found!"}
    return {"message": f"Hello, {name}!"}