from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, TIMESTAMP, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
import smtplib
import os
import random
import datetime
from email.mime.text import MIMEText 
from typing import List

# Gemini AI setup (optional)
try:
    from google import genai
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        GEMINI_CLIENT = genai
        print("Gemini Client Initialized Successfully.")
    else:
        print("Warning: GEMINI_API_KEY environment variable not found. AI features will be disabled.")
        GEMINI_CLIENT = None
except ImportError:
    print("Warning: google.generativeai package not found. AI features will be disabled.")
    GEMINI_CLIENT = None
except Exception as e:
    print(f"Warning: Gemini Client could not be initialized. AI features will be disabled. Error: {e}")
    GEMINI_CLIENT = None

# Time Constants
RESET_TOKEN_EXPIRE_MINUTES = 10

# SQLAlchemy setup
DATABASE_URL = "mysql+pymysql://root:1252006@localhost:3306/Login_Data"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# ---------------- MODELS ----------------
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    email = Column(String(150), primary_key=True, index=True)
    token = Column(String(6), nullable=False)
    expires_at = Column(TIMESTAMP, nullable=False)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    price = Column(String(50), nullable=False)
    description = Column(String(255), nullable=True)
    image = Column(String(255), nullable=True)
    category = Column(String(50), index=True, nullable=False) 

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables checked/created successfully.")
except Exception as e:
    print(f"CRITICAL DB ERROR: Could not connect or create tables. Error: {e}")

# Password hashing
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- SCHEMAS ----------------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    class Config:
        orm_mode = True

class ResetRequest(BaseModel):
    email: EmailStr
    
class PasswordUpdate(BaseModel):
    email: EmailStr
    token: str
    new_password: str

class GeminiQuery(BaseModel):
    query: str

class GeminiProductInfo(BaseModel):
    product_name: str
    price: str
    details: str | None = None

class ProductBase(BaseModel):
    id: int
    name: str
    price: str
    description: str | None = None
    image: str | None = None
    category: str
    class Config:
        orm_mode = True

# FastAPI App Instance
app = FastAPI(
    title="User Auth API with Gemini LLM",
    description="A secure auth system for heavy machinery app."
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- LLM ROUTES ----------------
@app.post("/gemini/generate_idea")
def generate_idea(payload: GeminiQuery):
    if not GEMINI_CLIENT:
        raise HTTPException(status_code=503, detail="Gemini service not available.")
    prompt = f"Give one highly innovative and practical product idea for heavy machinery or agriculture based on this category: {payload.query}. Be brief and focus on novelty."
    try:
        model = GEMINI_CLIENT.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        generated_text = response.text if hasattr(response, 'text') else "AI response format unexpected."
        return {"generated_text": generated_text}
    except Exception as e:
        print(f"AI API Error: {e}")
        raise HTTPException(status_code=500, detail=f"AI API Error: Failed to generate content.")

@app.post("/gemini/enhance_description")
def enhance_description(payload: GeminiProductInfo):
    if not GEMINI_CLIENT:
        raise HTTPException(status_code=503, detail="Gemini service not available.")
    prompt_parts = [
        f"Write a compelling, enthusiastic, 30-word marketing description for this product:",
        f"Name: {payload.product_name}",
        f"Price: {payload.price}"
    ]
    if payload.details:
        prompt_parts.append(f"Details: {payload.details}")
    prompt = "\n".join(prompt_parts)
    try:
        model = GEMINI_CLIENT.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        generated_text = response.text if hasattr(response, 'text') else "AI response format unexpected."
        return {"generated_text": generated_text}
    except Exception as e:
        print(f"AI API Error: {e}")
        raise HTTPException(status_code=500, detail=f"AI API Error: Failed to generate description.")

# ---------------- AUTH ROUTES ----------------
@app.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = pwd_context.hash(user.password)
    db_user = User(name=user.name, email=user.email, password_hash=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/login", response_model=UserResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
         raise HTTPException(status_code=401, detail="Invalid email or password")

    return db_user

@app.post("/reset-password")
def request_password_reset(request: ResetRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == request.email).first()
    if not db_user:
         print(f"Password reset requested for non-existent email: {request.email}")
         return {"message": f"If an account exists for {request.email}, a reset code has been sent. It expires in {RESET_TOKEN_EXPIRE_MINUTES} minutes."}

    token = str(random.randint(100000, 999999))
    expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    
    reset_entry = PasswordResetToken(email=request.email, token=token, expires_at=expires_at)
    db.merge(reset_entry) # Safely inserts or updates
    db.commit()

    EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD") 

    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        print("CRITICAL: Email environment variables not set.")
        return {"message": f"If an account exists for {request.email}, a reset code has been sent. It expires in {RESET_TOKEN_EXPIRE_MINUTES} minutes."}

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        email_body = (
            f"Your Password Reset Token is: {token}\n\n"
            f"This code will expire in {RESET_TOKEN_EXPIRE_MINUTES} minutes.\n"
            f"Please enter this code in the reset form to continue."
        )
        
        msg = MIMEText(email_body)
        msg['Subject'] = "Password Reset Token"
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = request.email

        server.sendmail(EMAIL_ADDRESS, request.email, msg.as_string())
        server.quit()
        print(f"Password reset email sent successfully to {request.email}")

    except Exception as e:
        print(f"CRITICAL SMTP Error: {e}")
    
    return {"message": f"If an account exists for {request.email}, a reset code has been sent. It expires in {RESET_TOKEN_EXPIRE_MINUTES} minutes."}


@app.post("/update-password")
def update_password(data: PasswordUpdate, db: Session = Depends(get_db)):
    token_entry = db.query(PasswordResetToken).filter(
        PasswordResetToken.email == data.email,
        PasswordResetToken.token == data.token
    ).first()
    
    is_expired = True
    if token_entry:
        is_expired = token_entry.expires_at < datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
    
    if not token_entry or is_expired:
       raise HTTPException(status_code=400, detail="Invalid, expired, or used token.")

    db_user = db.query(User).filter(User.email == data.email).first()
    if not db_user:
        db.delete(token_entry)
        db.commit()
        raise HTTPException(status_code=404, detail="User account not found.")

    db_user.password_hash = pwd_context.hash(data.new_password)
    db.delete(token_entry)
    db.commit()
    
    return {"message": "Password successfully updated. You can now log in."}

# ---------------- PRODUCT ROUTES ----------------
@app.get("/products/{category}", response_model=List[ProductBase])
def get_products_by_category(category: str, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.category == category).all()
    
    if not products:
        print(f"No products found for category: {category}")
        return []
        
    return products

# --- Root Endpoint ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the Heavy Machines API!"}