from sqlalchemy import Column, Integer, String, ForeignKey, Text
from database import Base
from sqlalchemy.orm import relationship

# ================= USER TABLE =================
class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(Text, nullable=False)

    carts = relationship("Cart", back_populates="user")


# ================= PRODUCT TABLE =================
class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    image = Column(String)

    carts = relationship("Cart", back_populates="product")


# ================= CART TABLE =================
class Cart(Base):
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    product_id = Column(Integer, ForeignKey("product.id"))
    quantity = Column(Integer, nullable=False)

    user = relationship("User", back_populates="carts")
    product = relationship("Product", back_populates="carts")
