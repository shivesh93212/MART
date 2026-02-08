from fastapi import FastAPI,Depends,UploadFile,Form,File,HTTPException
from database import SessionLocal,Base,engine
import models
from auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from models import Product,Cart,CartItem,User,Order,OrderItem
from sqlalchemy.orm import Session
import shutil
import uuid
import os
from datetime import datetime
import razorpay
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles

app=FastAPI()

load_dotenv()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)

os.makedirs("images", exist_ok=True)
app.mount("/images", StaticFiles(directory="images"), name="images")


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
    os.makedirs("images", exist_ok=True)
    filename = f"{uuid.uuid4()}_{image.filename}"
    image_path=f"images/{filename}"

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


# =================================================CART==============================================================

# *************************************************VIEW CART ITEM*********************************************************

@app.get("/cart/{cart_id}")
def get_all_item_in_cart(cart_id:int,db:Session=Depends(get_db)):
    carts=db.query(CartItem).filter(CartItem.cart_id==cart_id).order_by(CartItem.id).all()


    if not carts:
        raise HTTPException(status_code=404,detail="Cart is empty")
    
    cart_data = []
    for item in carts:
        cart_data.append({
            "id": item.id,
            "cart_id": item.cart_id,
            "product_id": item.product_id,
            "quantity": item.quantity,
            "product_name": item.product.name,
            "price": item.product.price,
            "image": item.product.image,
            "total_price": item.quantity * item.product.price
        })

    return cart_data

# ***************************************************************DELETE ITEMS IN CART**********************************

@app.delete("/cart/item/{id}")
def delete_cart_item(id:int,db:Session=Depends(get_db)):
    carts=db.query(CartItem).filter(CartItem.id==id).first()

    if carts is None:
        raise HTTPException(status_code=404,detail="ID NOT FOUND")
    
    db.delete(carts)
    db.commit()

    return {"message":"Cart Deleted Successfully!"}

# *************************************************************ADD ITEM IN CART***************************************

@app.post("/cart/add")
def add_item_in_cart(user_id:int,product_id:int,quantity:int=1,db:Session=Depends(get_db)):
    user=db.query(User).filter(User.id==user_id).first()

    if user is None:
        raise HTTPException(status_code=404,detail="WRONG USER ID")
    
    
    product=db.query(Product).filter(Product.id==product_id).first()

    if product is None:
        raise HTTPException(status_code=404,detail="WRONG PRODUCT ID")
    
    if quantity > product.quantity:
          raise HTTPException(400, "Out of stock")
    
    cart=db.query(Cart).filter(Cart.user_id==user_id).first()

    if not cart:
        cart=Cart(user_id=user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    cart_item=db.query(CartItem).filter(CartItem.cart_id==cart.id,CartItem.product_id==product.id).first()

    if cart_item:
        cart_item.quantity+=quantity

    else:
        cart_item=CartItem(
            cart_id=cart.id,
            product_id=product.id,
            quantity=quantity
        )
        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)

    return {
        "message": "Product added to cart successfully",
        "cart_id": cart.id,
        "product_id": product.id,
        "quantity": cart_item.quantity
    }

#***************************************************************UPDATE CART ITEM********************************************

@app.patch("/cart/item/{item_id}")
def update_cart(item_id:int,quantity:int,db:Session=Depends(get_db)):
    cart_item=db.query(CartItem).filter(CartItem.id==item_id).first()

    if cart_item is None:
        raise HTTPException(status_code=404,detail="PRODUCT NOT FOUND IN CART")
    
    if quantity <0:
        raise HTTPException(status_code=400,detail="QUANTITY NEVER IN NEGATIVE")
    
    if quantity==0:
        db.delete(cart_item)
        db.commit()
        return {"message":"Item Remove From The Cart"}

    product=db.query(Product).filter(Product.id==cart_item.product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")

    if quantity > product.quantity:
        raise HTTPException(400, "Out of stock")

    
    cart_item.quantity=quantity
    db.commit()
    db.refresh(cart_item)

    return {
        "message": "Quantity updated",
        "cart_item_id": cart_item.id,
        "quantity": cart_item.quantity
    }


    # ====================================================================ORDERS=================================================

# ************************************************************GRT USER ORDERS***************************************************

@app.get("/order/user/{user_id}")
def get_user_orders(user_id: int, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == user_id).all()
    return orders

# ****************************************************************GET  ORDERS DETAILS***********************************************

@app.get("/order/details/{order_id}")
def get_order_details(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()

    if order is None:
        raise HTTPException(status_code=404, detail="Order Not Found")

    return {
        "order_id": order.id,
        "total": order.total_amount,
        "status": order.status,
        "items": order.items
    }


# ===============================================PAYMENT======================================

key_id = os.getenv("RAZORPAY_KEY_ID")
key_secret = os.getenv("RAZORPAY_KEY_SECRET")

if not key_id or not key_secret:
    raise RuntimeError("Razorpay keys not loaded")

client = razorpay.Client(auth=(key_id, key_secret))


@app.post("/payment/create_order")
def create_payment_order(user_id:int,db:Session=Depends(get_db)):
    cart=db.query(Cart).filter(Cart.user_id==user_id).first()

    if cart is None:
        raise HTTPException(404,"Cart not found")
    
    cart_items=db.query(CartItem).filter(CartItem.cart_id==cart.id).all()

    if not cart_items:
        raise HTTPException(400,"Cart is empty")
    
    total_amount = 0
    for item in cart_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(404, "Product not found")

        
        if item.quantity > product.quantity:
            raise HTTPException(
                400,
                f"Only {product.quantity} items left for {product.name}"
            )

        total_amount += item.quantity * product.price
    
    order=Order(
        user_id=user_id,
        total_amount=total_amount,
        status="CREATED"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    payment_order=client.order.create({
        "amount":total_amount*100,
        "currency":"INR",
        "receipt":f"order_{order.id}"
    })

    return {
        "order_id":order.id,
        "razorpay_order_id":payment_order["id"],
        "amount":total_amount,
        "currency":"INR",
        "key":os.getenv("RAZORPAY_KEY_ID")
        
    }

#*********************************************PAYMENT VERIFICATION**********************************

@app.post("/payment/verify")
def verify_payment(
    order_id:int,
    razorpay_payment_id: str,
    razorpay_order_id: str,
    razorpay_signature: str,
    db:Session=Depends(get_db)
):
    try:
        client.utility.verify_payment_signature({
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_order_id": razorpay_order_id,
            "razorpay_signature": razorpay_signature
        })
    except:
        raise HTTPException(400,"Payment verification failed")
    
    order=db.query(Order).filter(Order.id==order_id).first()

    if not order:
        raise HTTPException(404,"Order not found")
    
    if order.status=="PAID":
        return {"message":"Order already paid"}
    
    order.status="PAID"
    order.payment_id=razorpay_payment_id

    cart=db.query(Cart).filter(Cart.user_id==order.user_id).first()
    if not cart:
       raise HTTPException(400, "Cart not found")

    cart_items=db.query(CartItem).filter(CartItem.cart_id==cart.id).all()

    for item in cart_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(404, "Product not found")

        if item.quantity > product.quantity:
            raise HTTPException(400, f"Not enough stock for {product.name}")

        product.quantity -= item.quantity

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        )
        db.add(order_item)

    db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).delete()

    db.commit()

    return {
        "message": "Payment successful, order confirmed",
        "order_id": order.id
    }
