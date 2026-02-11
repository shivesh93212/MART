from sqlalchemy import Column, Integer, String, ForeignKey, Text,Float,DateTime
from database import Base
from sqlalchemy.orm import relationship
from datetime import datetime
# ================= USER TABLE =================

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(Text, nullable=False)
    role=Column(String,default="user")
    
    cart = relationship("Cart", back_populates="user",uselist=False)


# ================= PRODUCT TABLE =================

class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    image = Column(String)

    category=Column(String,default="General")
    cart_items = relationship("CartItem", back_populates="product")

# ================= CART TABLE =================

class Cart(Base):
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
   

    user = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart",cascade="all, delete")

# ==================CART ITEM =====================

class CartItem(Base):
    __tablename__="cart_items"

    id=Column(Integer,primary_key=True,index=True)
    cart_id=Column(Integer,ForeignKey("cart.id"),nullable=False)
    product_id=Column(Integer,ForeignKey("product.id"),nullable=False)
    quantity=Column(Integer,nullable=False,default=1)

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product", back_populates="cart_items")

class Order(Base):
    __tablename__="orders"

    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,ForeignKey("user.id"))
    total_amount=Column(Integer)
    status=Column(String,default="PLACED")
    created_at=Column(DateTime,default=datetime.utcnow)

    items=relationship("OrderItem",back_populates="order")

class OrderItem(Base):
    __tablename__="order_items"

    id=Column(Integer,primary_key=True,index=True)
    order_id=Column(Integer,ForeignKey("orders.id"))
    product_id=Column(Integer,ForeignKey("product.id"))
    quantity=Column(Integer)
    price=Column(Integer)

    order=relationship("Order",back_populates="items")

    