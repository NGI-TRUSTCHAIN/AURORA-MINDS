from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """
    Custom manager for the User model.
    Provides helper methods to create regular users and superusers.
    """

    def create_user(self, email, password=None, **extra_fields):
        """
        Create and return a regular user with an email and password.

        Args:
            email (str): The user's email address.
            password (str): The user's password.
            **extra_fields: Additional fields for the user model.

        Returns:
            User: The created user instance.
        """
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)  # validate/format the input e-mail appropriately
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Password is hashed and stored securely
        user.save(using=self._db)  # Django's BaseUserManager auto-connects with the _db declared in settings
        return user

        # TODO 02: If necessary, implement a method to create a superuser
        #  def create_superuser(self, email, password):


class User(AbstractBaseUser):
    """
    Custom user model that uses email as the unique identifier instead of username.
    Inherits from AbstractBaseUser and PermissionsMixin for authentication and permissions handling.
    """

    id = models.AutoField(primary_key=True)  # Explicitly define the id field
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=15, null=True, blank=True)
    role = models.CharField(max_length=50)

    # Extra Settings
    objects = UserManager()  # The above manager now knows that when create a user, the above fields are used
    USERNAME_FIELD = 'email'  # Define 'email' as default username

    class Meta:
        db_table = 'login_user'  # Explicitly specify the table name

    def __str__(self):
        return self.email  # String representation of the user
