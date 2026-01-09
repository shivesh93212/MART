from pydantic import BaseModel


class SignupModel(BaseModel):
    name:str
    email:str
    password:str

    class Config:
        orm_mode=True

class LoginModel(BaseModel):
    email:str
    password:str

