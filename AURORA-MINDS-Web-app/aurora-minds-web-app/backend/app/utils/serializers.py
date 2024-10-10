from rest_framework import serializers

from ..models.entities.adhd import Adhd
from ..models.entities.child import Child
from ..models.entities.questionnaire import Questionnaire
from ..models.entities.user import User

"""
Serialization --> Convert Python objects to JSON data format 
"""


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration and data representation.
    """
    id = serializers.IntegerField(required=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'contact_number', 'role']
        extra_kwargs = {"password": {"write_only": True}}  # do not want to return the password to the frontend


class UserDtoSerializer(serializers.Serializer):
    """
    Serializer for UserDto to be nested in ChildSerializerWithUserDto.
    """
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    contact_number = serializers.CharField(max_length=15)
    role = serializers.CharField(max_length=50)
    id = serializers.IntegerField(required=False)


class ChildSerializer(serializers.ModelSerializer):
    """
    Serializer for 'Child' table.
    """
    # It can be included in the validated data when updating or deleting a record
    child_id = serializers.IntegerField(required=False)
    score = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)

    class Meta:
        model = Child
        fields = '__all__'


class ChildSerializerWithUserDto(serializers.ModelSerializer):
    """
    Serializer for 'Child' table, using UserDto for parent and clinician serialization.
    """
    parent_id = UserDtoSerializer()  # instead of just parent_id, return the whole UserDto
    clinician_id = UserDtoSerializer(allow_null=True)  # instead of just clinician_id, return the whole UserDto
    score = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)

    class Meta:
        model = Child
        fields = '__all__'


class AdhdSerializerJsonInput(serializers.ModelSerializer):
    """
    Serializer for 'Adhd' table.
    """

    adhd_id = serializers.IntegerField(required=False)  # Make adhd_id not required (works for the update)

    class Meta:
        model = Adhd
        fields = '__all__'


class AdhdSerializerJsonOutput(serializers.ModelSerializer):
    """
    Serializer for 'Adhd' table.
    """
    child_id = ChildSerializerWithUserDto()  # instead of just child_id, return the whole ChildDto

    class Meta:
        model = Adhd
        fields = '__all__'


class QuestionnaireSerializerJsonInput(serializers.ModelSerializer):
    """
    Serializer for 'Questionnaire' table.
    """

    # It can be included in the validated data when updating or deleting a record
    questionnaire_id = serializers.IntegerField(required=False)

    class Meta:
        model = Questionnaire
        fields = '__all__'


class QuestionnaireSerializerJsonOutput(serializers.ModelSerializer):
    """
    Serializer for 'Questionnaire' table.
    """

    # It can be included in the validated data when updating or deleting a record
    questionnaire_id = serializers.IntegerField(required=False)
    # Instead of just child_id, return the whole ChildDto
    child_id = ChildSerializerWithUserDto()

    class Meta:
        model = Questionnaire
        fields = '__all__'
