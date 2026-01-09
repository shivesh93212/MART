from fastapi import APIRouter,Depends,HTTPException
from schemas import SignupModel,LoginModel
from database import SessionLocal
from models import User
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from utils import create_access_token

router=APIRouter(prefix="/auth",tags=["auth"])

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup",response_model=SignupModel)
def signup(user:SignupModel,db:Session=Depends(get_db)):
    db_email=db.query(User).filter(User.email==user.email).first()

    if db_email is not None:
        raise HTTPException(status_code=400,detail="email alredy exists")
    db_username=db.query(User).filter(User.name==user.email).first()

    if db_username is not None:
        raise HTTPException(status_code=400,detail="Username alredy exist")
    
    hashed=pwd_context.hash(user.password[:72])
    new_user=User(
        name=user.name,
        email=user.email,
        password=hashed
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")
def login(data:LoginModel,db:Session=Depends(get_db)):
    db_email=db.query(User).filter(User.email==data.email).first()

    if db_email is None:
        raise HTTPException(status_code=400,detail="email not found")
    

    if not pwd_context.verify(data.password, str(db_email.password)):
        raise HTTPException(status_code=400, detail="Wrong password")
    
    token=create_access_token({"user_id":db_email.id})

    return {
        "access_token":token,
        "token_type":"bearer",
        "user_id":db_email.id
    }
