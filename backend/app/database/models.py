from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    assessments = relationship("Assessment", back_populates="owner", cascade="all, delete-orphan")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    patient_alias = Column(String(120), default="Anonymous Assessment", nullable=False)
    input_data = Column(Text, nullable=False)  # JSON serialized clinical features
    prediction_result = Column(Text, nullable=False)  # JSON serialized model outputs
    model_version = Column(String(64), default="scikit-learn-1.9.1", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    owner = relationship("User", back_populates="assessments")
