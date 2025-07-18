from datetime import datetime, timedelta
from fastapi.responses import JSONResponse
from jose import JWTError, jwt

from environment_variables import environment_variables

# Config

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=environment_variables.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, environment_variables.SECRET_KEY, algorithm=environment_variables.ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, environment_variables.SECRET_KEY, algorithms=[environment_variables.ALGORITHM])
        return payload
    except JWTError:
        return None
    
async def create_response_with_token(user, status_code = 200):
    token = create_access_token({"sub": str(user.id)}, expires_delta=timedelta(minutes=60))
    response = JSONResponse(content={"user": await user.custom_model_dump(exclude={"password"}, mode="json")}, status_code=status_code)
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        max_age=60 * 60,  # 60 mins
        samesite="none", # "lax" if same site
        secure=True  # using https or not
    )
    return response