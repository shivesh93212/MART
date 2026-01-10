from fastapi import FastAPI,Depends,UploadFile,Form,File,HTTPException
from database import SessionLocal,Base,engine
import models
from auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from models import Product
from sqlalchemy.orm import Session
import shutil
import uuid
import os

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)


def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
         db.close()

@app.get("/")
def hello():
    return {"message":"hello"}

# ************************************ADD PRODUCT*************************************************************

@app.post("/product")
def add_product(
    name: str = Form(...),
    price: float = Form(...),
    quantity: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    image_path=f"images/{image.filename}"
    with open(image_path,"wb") as buffer:
      shutil.copyfileobj(image.file,buffer)

    new_product=Product(
        name=name,
        price=price,
        quantity=quantity,
        image=image_path
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {"message":"peoduct added successfully!"}


# *************************************************DELETE PRODUCT***************************************************

@app.delete("/product/{id}")
def delete_product(id:int , db:Session=Depends(get_db)):
    delete_product=db.query(Product).filter(Product.id==id).first()

    if delete_product is None:
        raise HTTPException(status_code=404,detail="Please Enter Valid id")
    
    db.delete(delete_product)
    db.commit()
    

    return {"message":"product deleted successfully!"}

#***************************************************GET ALL PRODUCT***************************************************

@app.get("/product")
def get_all_products(db:Session=Depends(get_db)):
    products=db.query(models.Product).all()

    return products

# **************************************************UPDATE PRODUCT****************************************************

@app.patch("/product/{id}")
def update_product(
    id: int,
    name: str | None = Form(None),
    price: float | None = Form(None),
    quantity: int | None = Form(None),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    if name is not None:
        product.name = name

    if price is not None:
        product.price = price

    if quantity is not None:
        product.quantity = quantity
   

    db.commit()

    return {"message": "Product updated successfully"}

# **********************************************************UPDATE IMAGE**********************************************

@app.patch("/product/{id}/image")
def update_image(
    id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
   
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="ID NOT FOUND")

   
    if not image.filename:
        raise HTTPException(status_code=400, detail="No image file received")

    print("RECEIVED FILE:", image.filename)

  
    os.makedirs("images", exist_ok=True)

    
    filename = f"{uuid.uuid4()}_{image.filename}"
    image_path = f"images/{filename}"

    
    try:
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File save failed: {e}")

  
    product.image = image_path
    db.commit()
    db.refresh(product)

    return {
        "message": "IMAGE UPDATED SUCCESSFULLY",
        
    }