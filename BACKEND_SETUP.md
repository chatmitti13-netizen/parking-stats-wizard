# FastAPI Backend Setup

## Required Endpoints

### 1. Login Endpoint
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "username": "admin",
  "password": "admin123"
}

Response (Success - 200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}

Response (Error - 401):
{
  "detail": "Login yoki parol noto'g'ri"
}
```

### 2. Dashboard Stats Endpoint
```
GET /api/stats/dashboard
Authorization: Bearer {access_token}

Response (200):
{
  "today": 198,
  "weekly": 1356,
  "monthly": 5615,
  "weekly_data": [
    { "name": "Dush", "cars": 145 },
    { "name": "Sesh", "cars": 178 },
    { "name": "Chor", "cars": 156 },
    { "name": "Pay", "cars": 189 },
    { "name": "Jum", "cars": 234 },
    { "name": "Shan", "cars": 267 },
    { "name": "Yak", "cars": 198 }
  ],
  "monthly_data": [
    { "name": "1-hafta", "cars": 1203 },
    { "name": "2-hafta", "cars": 1456 },
    { "name": "3-hafta", "cars": 1389 },
    { "name": "4-hafta", "cars": 1567 }
  ]
}

Response (Error - 401):
{
  "detail": "Token yaroqsiz"
}
```

### 3. Token Verification (Optional)
```
GET /api/auth/verify
Authorization: Bearer {access_token}

Response (200):
{
  "valid": true
}

Response (401):
{
  "detail": "Token yaroqsiz"
}
```

## CORS Configuration (REQUIRED)

FastAPI backend must enable CORS to allow frontend requests:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",  # Development
        "https://your-production-domain.com"  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Example FastAPI Implementation

```python
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt

app = FastAPI()

# CORS
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Security
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "your-secret-key-here"  # Change this!

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Token yaroqsiz")

# Endpoints
@app.post("/api/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    if request.username == "admin" and request.password == "admin123":
        token = create_access_token({"sub": request.username})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {"username": request.username, "role": "admin"}
        }
    raise HTTPException(status_code=401, detail="Login yoki parol noto'g'ri")

@app.get("/api/stats/dashboard")
async def get_dashboard_stats(user = Depends(verify_token)):
    # Replace with actual database queries
    return {
        "today": 198,
        "weekly": 1356,
        "monthly": 5615,
        "weekly_data": [
            {"name": "Dush", "cars": 145},
            {"name": "Sesh", "cars": 178},
            {"name": "Chor", "cars": 156},
            {"name": "Pay", "cars": 189},
            {"name": "Jum", "cars": 234},
            {"name": "Shan", "cars": 267},
            {"name": "Yak", "cars": 198}
        ],
        "monthly_data": [
            {"name": "1-hafta", "cars": 1203},
            {"name": "2-hafta", "cars": 1456},
            {"name": "3-hafta", "cars": 1389},
            {"name": "4-hafta", "cars": 1567}
        ]
    }

@app.get("/api/auth/verify")
async def verify(user = Depends(verify_token)):
    return {"valid": True}
```

## Running the Backend

```bash
# Install dependencies
pip install fastapi uvicorn pyjwt python-multipart

# Run server
uvicorn main:app --reload --port 8000
```

## Environment Variables

Create a `.env` file in the frontend root:
```
VITE_API_URL=http://localhost:8000
```

For production, update to your production API URL.
