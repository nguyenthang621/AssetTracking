from datetime import datetime
# from werkzeug.security import generate_password_hash, check_password_hash
from app.databases.db import db
from sqlalchemy import Table, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, DeclarativeBase
from sqlalchemy.orm import mapped_column, Mapped
from datetime import datetime
from typing import List, Optional

class TimestampMixin:
    created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
class Base(DeclarativeBase):
    pass

# # Bảng trung gian cho quan hệ nhiều-nhiều
# user_asset_association = Table(
#     'user_asset', 
#     db.Model.metadata,
#     Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
#     Column('asset_id', Integer, ForeignKey('assets.id'), primary_key=True)
# )

class user_asset_association(Base):
    __tablename__ = "association_table"
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id"), primary_key=True)
    extra_data: Mapped[Optional[str]]
    child: Mapped["Asset"] = relationship()

zone_asset_association = Table(
    'zone_asset', 
    db.Model.metadata,
    Column('zone_id', Integer, ForeignKey('zones.id'), primary_key=True),
    Column('asset_id', Integer, ForeignKey('assets.id'), primary_key=True)
)


class User(db.Model, TimestampMixin):
    __tablename__ = 'users'

    id : Mapped[int] = mapped_column(primary_key=True)
    username = Column(String(32), nullable=False)
    password = Column(String, nullable=False)
    mail = Column(String)
    active = Column(db.Boolean, default=True)
    date_joined = Column(db.DateTime, default=datetime.utcnow)

    # assets = relationship('Asset', secondary=user_asset_association, back_populates='users')
    assets : Mapped[List["user_asset_association"]] = relationship()

    def __init__(self, username, password, mail, active, date_joined):
        self.username = username
        self.password = password
        # self.set_password(password)
        self.mail = mail
        self.active = active
        self.date_joined = date_joined

    def __repr__(self):
        return f"<User(id={self.id}, name={self.username}, email={self.mail})>"

    # def set_password(self, password):
    #     self.password = generate_password_hash(password)

    # def check_password(self, password):
    #     return check_password_hash(self.password, password)

    def update_email(self, new_email):
        self.mail = new_email

    def update_username(self, new_username):
        self.username = new_username

    def check_active(self):
        return self.active

    def set_active(self, set_status):
        self.active = set_status

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'active': self.active,
            'date_joined': self.date_joined.isoformat(),
            'mail': self.mail,
            'assets': self.assets
        }

    def to_json(self):
        return self.to_dict()
    def serialize(self):
        return self.to_dict()


class Asset(db.Model):
    __tablename__ = 'assets'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    status = Column(String)
    users = relationship('User', secondary=user_asset_association, back_populates='assets')
    zones = relationship('Zone', secondary=zone_asset_association, back_populates='assets')


    def __init__(self, name, description, status):
        self.name = name
        self.description = description
        self.status = status

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'status': self.status
        }
    def __repr__(self):
        return f"<Asset(id={self.id}, name={self.name})>"
    def to_json(self):
        return self.to_dict()
    def serialize(self):
        return self.to_dict()



class Zone(db.Model):
    __tablename__ = 'zones'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    coordinates = Column(String, nullable=False)
    description = Column(String)
    type = Column(String)
    active = Column(db.Boolean, default=True)
    assets = relationship('Asset', secondary=zone_asset_association, back_populates='zones')

    def __init__(self, name, coordinates, description,type, active):
        self.name = name
        self.coordinates = coordinates
        self.description = description
        self.type = type
        self.active = active

    def __repr__(self):
        return f"<Asset(id={self.id}, name={self.name})>"
    def serialize(self):
        return self.to_dict()