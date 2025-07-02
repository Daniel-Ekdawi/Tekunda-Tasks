from fastapi import Request
from jose import JWTError, jwt
from fastapi import APIRouter, HTTPException
from models.user import User

router = APIRouter()

SECRET_KEY = "tekunda-is-the-best"
ALGORITHM = "HS256"

@router.get("/validateToken")
async def validate_token(request: Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = await User.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user.model_dump(exclude={"password"}, mode="json")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalid")