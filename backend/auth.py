from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from models import User
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from utils import create_access_token
from fastapi.security import OAuth2PasswordRequestForm
from schemas import SignupModel

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@router.post("/signup")
def signup(user:SignupModel,db:Session=Depends(get_db)):
    user_email=db.query(User).filter(User.email==user.email).first()

    if user_email:
        raise HTTPException(400,"Email Aleready register")
    
    hashed=pwd_context.hash(user.password)
    new_user=User(
        name=user.name,
        email=user.email,
        password=hashed
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message":"User Created Successfully!"}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(status_code=400, detail="email not found")

    if not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Wrong password")

    token = create_access_token({"user_id": user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }
