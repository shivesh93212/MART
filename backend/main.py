from fastapi import FastAPI,Depends
from database import SessionLocal,Base,engine
import models


app=FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
def hello():
    return {"message":"hello"}

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
