from sqlalchemy import Column, Integer, String, Numeric
from sqlalchemy.ext.declarative import declarative_base

''' SQLAlchemy models that reflect the tables in the PostgreSQL database (ORM) '''

Base = declarative_base()


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class ADHD(Base):
    __tablename__ = 'adhd'
    adhd_id = Column(Integer, primary_key=True, autoincrement=True)
    perception_1 = Column(Numeric)
    fine_motor = Column(Numeric)
    pre_writing = Column(Numeric)
    visual_motor_integration = Column(Numeric)
    spatial_orientation = Column(Numeric)
    perception_2 = Column(Numeric)
    cognitive_flexibility = Column(Numeric)
    attention_deficit = Column(Numeric)
    sustained_attention = Column(Numeric)
    target = Column(Numeric)
    parent_id = Column(Integer)
    clinician_id = Column(Integer, nullable=False)
    child_id = Column(Integer, nullable=False)
