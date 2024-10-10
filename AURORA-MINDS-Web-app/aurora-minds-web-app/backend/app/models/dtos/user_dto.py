from dataclasses import dataclass
from typing import Optional


@dataclass
class UserRegistrationDto:
    email: str
    password: str
    first_name: str
    last_name: str
    contact_number: str
    role: str


@dataclass
class UserLoginDto:
    email: str
    password: str


@dataclass
class UserDto:
    email: str
    first_name: str
    last_name: str
    contact_number: str
    role: str
    id: Optional[int] = None
