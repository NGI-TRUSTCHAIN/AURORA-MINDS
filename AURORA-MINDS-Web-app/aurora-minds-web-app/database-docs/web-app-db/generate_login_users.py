import requests
# import bcrypt
from datetime import datetime, timedelta


def generate_parents(num_parents):
    parents = []
    for i in range(1, num_parents + 1):
        password = f'password{i}'
        # hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        parent = {
            'first_name': f'ParentFirstName{i}',
            'last_name': f'ParentLastName{i}',
            'email': f'parent{i}@example.com',
            'password': password,
            'contact_number': '123-456-7890',
            'role': 'PARENT',
            'last_login': (datetime.now() - timedelta(days=i)).isoformat()
        }
        parents.append(parent)
    return parents


def generate_clinicians(num_clinicians):
    clinicians = []
    for i in range(1, num_clinicians + 1):
        password = f'password{i}'
        # hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        clinician = {
            'first_name': f'ClinicianFirstName{i}',
            'last_name': f'ClinicianLastName{i}',
            'email': f'clinician{i}@example.com',
            'password': password,
            'contact_number': '123-456-7890',
            'role': 'CLINICIAN',
            'last_login': (datetime.now() - timedelta(days=i)).isoformat()
        }
        clinicians.append(clinician)
    return clinicians


def generate_admins(num_admins):
    admins = []
    for i in range(1, num_admins + 1):
        password = f'adminpassword{i}'
        # hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        admin = {
            'first_name': f'AdminFirstName{i}',
            'last_name': f'AdminLastName{i}',
            'email': f'admin{i}@example.com',
            'password': password,
            'contact_number': '123-456-7890',
            'role': 'ADMIN',
            'last_login': (datetime.now() - timedelta(days=i)).isoformat()
        }
        admins.append(admin)
    return admins


def register_users(users):
    # API endpoint for registering users
    REGISTER_API_URL = 'http://127.0.0.1:8000/users/register/'

    for user in users:
        # Prepare the payload for the API request
        payload = {
            'first_name': user['first_name'],
            'last_name': user['last_name'],
            'email': user['email'],
            'password': user['password'],
            'contact_number': user['contact_number'],
            'role': user['role'],
            'last_login': user['last_login']
        }

        # Make the API request to register the user
        response = requests.post(REGISTER_API_URL, data=payload)

        if response.status_code == 201:
            print(f'Successfully created user: {user["email"]}')
        else:
            print(
                f'Failed to create user: {user["email"]}, Status Code: {response.status_code}, Response: {response.text}')


if __name__ == "__main__":
    # -- Number of children
    # -- We have 451 children
    # -- Assuming each parent has 2 unique children, so we need 451 / 2 = 226 parents
    # -- There are 5 clinicians (by default)
    num_children = 451
    num_parents = (num_children + 1) // 2
    num_clinicians = 5
    num_admins = 1  # Specify the number of admins to create

    clinicians = generate_clinicians(num_clinicians)  # create them first (must)
    parents = generate_parents(num_parents)
    admins = generate_admins(num_admins)

    users = clinicians + parents + admins
    register_users(users)
