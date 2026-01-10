from sqlalchemy import Column, Integer, String, ForeignKey, Text,Float
from database import Base
from sqlalchemy.orm import relationship

# ================= USER TABLE =================

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(Text, nullable=False)

    cart = relationship("Cart", back_populates="user",uselist=False)


# ================= PRODUCT TABLE =================

class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    image = Column(String)



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
    product = relationship("Product")

