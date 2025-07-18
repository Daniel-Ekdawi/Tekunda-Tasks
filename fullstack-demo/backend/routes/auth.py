from fastapi import Request, status
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from fastapi import APIRouter, HTTPException
from environment_variables import environment_variables
from services.auth.jwt_handler import create_response_with_token
from services.auth.login_request_model import LoginRequest
from services.auth.bcrypt_handler import hash_password, verify_password
from models.user import User, UserResponse
from pymongo.errors import DuplicateKeyError

router = APIRouter()

# Sign up
@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
async def signup(user: User):
    try:
        hashed_pwd = hash_password(user.password)
        user.password = hashed_pwd
        await user.insert()
        return await create_response_with_token(user, status_code=201)
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
        return await create_response_with_token(user)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Logout
@router.post("/logout")
async def logout():
    try:
        response = JSONResponse(content={"message": "Logged out"})
        response.delete_cookie(
            key="token",
            path="/",
            samesite="none",
            secure=True
        )
        return response
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    


@router.get("/validateToken")
async def validate_token(request: Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")

    try:
        payload = jwt.decode(token, environment_variables.SECRET_KEY, algorithms=[environment_variables.ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = await User.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found, please relog")

        if not user.is_active:
            raise HTTPException(status_code=403, detail="User not activated yet")

        return await user.custom_model_dump(exclude={"password"}, mode="json")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalid")