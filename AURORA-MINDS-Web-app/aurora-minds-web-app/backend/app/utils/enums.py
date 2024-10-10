from enum import Enum


class Role(Enum):
    PARENT = "PARENT"
    CLINICIAN = "CLINICIAN"
    ADMIN = "ADMIN"

    # Return a list of all the enums/roles belong to the Role class
    @classmethod
    def list_roles(cls):
        return [role.value for role in cls]
