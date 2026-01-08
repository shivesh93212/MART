from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL=str(os.getenv("DATABASE_URL"))
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL NOT SET")

engine=create_engine(DATABASE_URL,pool_pre_ping=True)
SessionLocal=sessionmaker(bind=engine,autoflush=False,autocommit=False)

Base=declarative_base()