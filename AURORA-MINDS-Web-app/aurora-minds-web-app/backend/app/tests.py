import factory
from django.test import TestCase

from .models.dtos.adhd_dto import AdhdDto
from .models.dtos.child_dto import ChildDto
from .models.dtos.questionnaire_dto import QuestionnaireDto
from .models.entities.adhd import Adhd
from .models.entities.child import Child
from .models.entities.questionnaire import Questionnaire
from .models.entities.user import User
from .repositories.adhd_repository import AdhdRepository
from .repositories.child_repository import ChildRepository
from .repositories.questionnaire_repository import QuestionnaireRepository
from .repositories.user_repository import UserRepository
from .services.adhd_service import AdhdService
from .services.child_service import ChildService
from .services.questionnaire_service import QuestionnaireService
from .services.user_service import UserService
from .utils.enums import Role
from .utils.exceptions import CustomException


# Define a factory for User model
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Faker('email')
    password = factory.Faker('password', length=10)  # Ensure the password is within the limit
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    contact_number = factory.Faker('numerify', text='###########')  # Ensure the contact number is within the limit
    role = Role.PARENT.value


# Define a factory for ChildDto
class ChildDtoFactory(factory.Factory):
    class Meta:
        model = ChildDto

    child_id = factory.Sequence(lambda n: n + 1)  # Adjusted sequence to start from 1
    score = factory.Faker('pyfloat', left_digits=2, right_digits=2, positive=True)
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    clinician_id = factory.SubFactory(UserFactory, role=Role.CLINICIAN.value)
    parent_id = factory.SubFactory(UserFactory, role=Role.PARENT.value)


# Define a factory for Child model
class ChildFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Child

    child_id = factory.Sequence(lambda n: n + 1)  # Adjusted sequence to start from 1
    score = factory.Faker('pyfloat', left_digits=2, right_digits=2, positive=True)
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    clinician_id = factory.SubFactory(UserFactory, role=Role.CLINICIAN.value)
    parent_id = factory.SubFactory(UserFactory, role=Role.PARENT.value)


# Define a factory for AdhdDto
class AdhdDtoFactory(factory.Factory):
    class Meta:
        model = AdhdDto

    adhd_id = factory.Sequence(lambda n: n + 1)  # Adjusted sequence to start from 1
    perception_1 = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    fine_motor = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    pre_writing = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    visual_motor_integration = factory.Faker('pyfloat', left_digits=2, right_digits=8, positive=True)
    spatial_orientation = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    perception_2 = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    cognitive_flexibility = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    attention_deficit = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    sustained_attention = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    target = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    child_id = factory.SubFactory(ChildFactory)


# Define a factory for Adhd model
class AdhdFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Adhd

    adhd_id = factory.Sequence(lambda n: n + 1)  # Adjusted sequence to start from 1
    perception_1 = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    fine_motor = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    pre_writing = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    visual_motor_integration = factory.Faker('pyfloat', left_digits=2, right_digits=8, positive=True)
    spatial_orientation = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    perception_2 = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    cognitive_flexibility = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    attention_deficit = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    sustained_attention = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    target = factory.Faker('pyfloat', left_digits=2, right_digits=1, positive=True)
    child_id = factory.SubFactory(ChildFactory)


# Define a factory for QuestionnaireDto
class QuestionnaireDtoFactory(factory.Factory):
    class Meta:
        model = QuestionnaireDto

    gender = factory.Faker('random_element', elements=['Male', 'Female'])
    weight = factory.Faker('pyfloat', left_digits=2, right_digits=2, positive=True)
    height = factory.Faker('pyfloat', left_digits=2, right_digits=2, positive=True)
    date_of_birth = factory.Faker('date_of_birth')
    is_native_greek_language = factory.Faker('boolean')
    place_of_residence = factory.Faker('city')
    regional_unit = factory.Faker('city')
    school_name = factory.Faker('company')
    school_grade = factory.Faker('random_element', elements=['Grade 1', 'Grade 2', 'Grade 3'])
    school_class_section = factory.Faker('random_letter')
    has_parent_fully_custody = factory.Faker('boolean')
    comments = factory.Faker('text')
    has_hearing_problem = factory.Faker('boolean')
    has_vision_problem = factory.Faker('boolean')
    has_early_learning_difficulties = factory.Faker('boolean')
    has_delayed_development = factory.Faker('boolean')
    has_autism = factory.Faker('boolean')
    has_deprivation_neglect = factory.Faker('boolean')
    has_childhood_aphasia = factory.Faker('boolean')
    has_intellectual_disability = factory.Faker('boolean')
    child_id = factory.SubFactory(ChildFactory)
    questionnaire_id = factory.Sequence(lambda n: n + 1)  # Adjusted sequence to start from 1


# Define a factory for Questionnaire model
class QuestionnaireFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Questionnaire

    gender = factory.Faker('random_element', elements=['Male', 'Female'])
    weight = factory.Faker('pyfloat', left_digits=2, right_digits=2, positive=True)
    height = factory.Faker('pyfloat', left_digits=2, right_digits=2, positive=True)
    date_of_birth = factory.Faker('date_of_birth')
    is_native_greek_language = factory.Faker('boolean')
    place_of_residence = factory.Faker('city')
    regional_unit = factory.Faker('city')
    school_name = factory.Faker('company')
    school_grade = factory.Faker('random_element', elements=['Grade 1', 'Grade 2', 'Grade 3'])
    school_class_section = factory.Faker('random_letter')
    has_parent_fully_custody = factory.Faker('boolean')
    comments = factory.Faker('text')
    has_hearing_problem = factory.Faker('boolean')
    has_vision_problem = factory.Faker('boolean')
    has_early_learning_difficulties = factory.Faker('boolean')
    has_delayed_development = factory.Faker('boolean')
    has_autism = factory.Faker('boolean')
    has_deprivation_neglect = factory.Faker('boolean')
    has_childhood_aphasia = factory.Faker('boolean')
    has_intellectual_disability = factory.Faker('boolean')
    child_id = factory.SubFactory(ChildFactory)


class UserServiceTest(TestCase):

    def setUp(self):
        # Create a mock repository and service
        self.user_repository = UserRepository()
        self.user_service = UserService(self.user_repository)
        self.user = UserFactory()
        # Create users for testing
        self.user_parent = UserFactory(role=Role.PARENT.value)
        self.user_clinician = UserFactory(role=Role.CLINICIAN.value)
        self.user_admin = UserFactory(role=Role.ADMIN.value)

    def test_get_user_by_id_success(self):
        """Test retrieving a user by ID successfully"""
        user_dto = self.user_service.get_user_by_id(self.user.id)
        self.assertIsNotNone(user_dto)
        self.assertEqual(user_dto.email, self.user.email)
        self.assertEqual(user_dto.role, self.user.role)

    def test_get_user_by_id_non_existing(self):
        """Test retrieving a non-existing user by ID"""
        user_dto = self.user_service.get_user_by_id(9999)
        self.assertIsNone(user_dto)

    def test_get_user_by_id_and_role_success(self):
        """Test retrieving a user by ID and role successfully"""
        user_dto = self.user_service.get_user_by_id_and_role(self.user.id, self.user.role)
        self.assertIsNotNone(user_dto)
        self.assertEqual(user_dto.email, self.user.email)
        self.assertEqual(user_dto.role, self.user.role)

    def test_get_user_by_id_and_role_non_existing(self):
        """Test retrieving a non-existing user by ID and role"""
        with self.assertRaises(CustomException):
            self.user_service.get_user_by_id_and_role(9999, Role.PARENT.value)

    def test_get_user_by_id_and_role_wrong_role(self):
        """Test retrieving a user by ID with a wrong role"""
        with self.assertRaises(CustomException):
            self.user_service.get_user_by_id_and_role(self.user.id, Role.CLINICIAN.value)

    def test_get_users_by_role_parent(self):
        """Test retrieving users by PARENT role successfully"""
        users_dto = self.user_service.get_users_by_role(Role.PARENT.value)
        self.assertTrue(any(user.email == self.user_parent.email for user in users_dto))
        self.assertTrue(all(user.role == Role.PARENT.value for user in users_dto))

    def test_get_users_by_role_clinician(self):
        """Test retrieving users by CLINICIAN role successfully"""
        users_dto = self.user_service.get_users_by_role(Role.CLINICIAN.value)
        self.assertTrue(any(user.email == self.user_clinician.email for user in users_dto))
        self.assertTrue(all(user.role == Role.CLINICIAN.value for user in users_dto))

    def test_get_users_by_role_admin(self):
        """Test retrieving users by ADMIN role successfully"""
        users_dto = self.user_service.get_users_by_role(Role.ADMIN.value)
        self.assertTrue(any(user.email == self.user_admin.email for user in users_dto))
        self.assertTrue(all(user.role == Role.ADMIN.value for user in users_dto))

    def test_get_users_by_role_invalid(self):
        """Test retrieving users by an invalid role returns an empty list"""
        users_dto = self.user_service.get_users_by_role('INVALID_ROLE')
        self.assertEqual(len(users_dto), 0)


class ChildServiceTest(TestCase):

    def setUp(self):
        # Create a random Child DTO using factory_boy
        self.child_dto = ChildDtoFactory()

        # Create a mock repository
        self.child_repository = ChildRepository()
        self.child_service = ChildService(self.child_repository)

    def test_create_child_success(self):
        """Test creating a child successfully"""
        try:
            created_child_dto = self.child_service.create_child_serv(self.child_dto)
            self.assertIsNotNone(created_child_dto.child_id)
            self.assertEqual(created_child_dto.first_name, self.child_dto.first_name)
            self.assertEqual(created_child_dto.last_name, self.child_dto.last_name)
            self.assertEqual(created_child_dto.score, self.child_dto.score)
        except CustomException as e:
            self.fail(f"Child creation failed with CustomException: {e}")

    def test_update_child_success(self):
        """Test updating a child successfully"""
        child = ChildFactory(parent_id=self.child_dto.parent_id, clinician_id=self.child_dto.clinician_id)
        update_dto = ChildDtoFactory(child_id=child.child_id)
        try:
            updated_child_dto = self.child_service.update_child_serv(update_dto)
            self.assertEqual(updated_child_dto.child_id, child.child_id)
            self.assertEqual(updated_child_dto.first_name, update_dto.first_name)
            self.assertEqual(updated_child_dto.last_name, update_dto.last_name)
            self.assertEqual(updated_child_dto.score, update_dto.score)
        except CustomException as e:
            self.fail(f"Child update failed with CustomException: {e}")

    def test_update_child_non_existing(self):
        """Test updating a non-existing child"""
        non_existing_child_dto = ChildDtoFactory(child_id=9999)
        with self.assertRaises(CustomException):
            self.child_service.update_child_serv(non_existing_child_dto)

    def test_delete_child_success(self):
        """Test deleting a child successfully"""
        child = ChildFactory(parent_id=self.child_dto.parent_id, clinician_id=self.child_dto.clinician_id)
        try:
            delete_dto = ChildDtoFactory(child_id=child.child_id)
            self.child_service.delete_child_serv(delete_dto)
            with self.assertRaises(Child.DoesNotExist):
                Child.objects.get(child_id=child.child_id)
        except CustomException as e:
            self.fail(f"Child deletion failed with CustomException: {e}")

    def test_delete_child_non_existing(self):
        """Test deleting a non-existing child"""
        non_existing_child_dto = ChildDtoFactory(child_id=9999)
        with self.assertRaises(CustomException):
            self.child_service.delete_child_serv(non_existing_child_dto)

    def test_list_children_by_user_parent_success(self):
        """Test listing children by a parent who has children"""
        parent_id = self.child_dto.parent_id.id
        children = ChildFactory.create_batch(3, parent_id=self.child_dto.parent_id)
        try:
            children_dto_list = self.child_service.get_children_by_user(parent_id, Role.PARENT.value)
            self.assertEqual(len(children_dto_list), len(children))
            for child_dto, child in zip(children_dto_list, children):
                self.assertEqual(child_dto.child_id, child.child_id)
                self.assertEqual(child_dto.parent_id.id, child.parent_id.id)
        except CustomException as e:
            self.fail(f"Listing children by parent failed with CustomException: {e}")

    def test_list_children_by_user_parent_no_children(self):
        """Test listing children by a parent who has no children"""
        empty_parent_id = 9999
        try:
            empty_children_dto_list = self.child_service.get_children_by_user(empty_parent_id, Role.PARENT.value)
            self.assertEqual(len(empty_children_dto_list), 0)
        except CustomException as e:
            self.fail(f"Listing children by parent failed with CustomException: {e}")

    def test_list_children_by_user_clinician_success(self):
        """Test listing children by a clinician who has children"""
        clinician_id = self.child_dto.clinician_id.id
        children = ChildFactory.create_batch(3, clinician_id=self.child_dto.clinician_id)
        try:
            children_dto_list = self.child_service.get_children_by_user(clinician_id, Role.CLINICIAN.value)
            self.assertEqual(len(children_dto_list), len(children))
            for child_dto, child in zip(children_dto_list, children):
                self.assertEqual(child_dto.child_id, child.child_id)
                self.assertEqual(child_dto.clinician_id.id, child.clinician_id.id)
        except CustomException as e:
            self.fail(f"Listing children by clinician failed with CustomException: {e}")

    def test_list_children_by_user_clinician_no_children(self):
        """Test listing children by a clinician who has no children"""
        empty_clinician_id = 9999
        try:
            empty_children_dto_list = self.child_service.get_children_by_user(empty_clinician_id, Role.CLINICIAN.value)
            self.assertEqual(len(empty_children_dto_list), 0)
        except CustomException as e:
            self.fail(f"Listing children by clinician failed with CustomException: {e}")

    def test_delete_parent_cascades_to_children(self):
        """Test deleting a parent cascades to delete their children"""
        parent = UserFactory(role=Role.PARENT.value)
        child = ChildFactory(parent_id=parent)
        parent.delete()
        with self.assertRaises(Child.DoesNotExist):
            Child.objects.get(child_id=child.child_id)

    def test_delete_clinician_sets_clinician_id_to_null(self):
        """Test deleting a clinician sets clinician_id to NULL for their children"""
        clinician = UserFactory(role=Role.CLINICIAN.value)
        child = ChildFactory(clinician_id=clinician)
        clinician.delete()
        updated_child = Child.objects.get(child_id=child.child_id)
        self.assertIsNone(updated_child.clinician_id)


class AdhdServiceTest(TestCase):

    def setUp(self):
        # Create a random ADHD DTO using factory_boy
        self.adhd_dto = AdhdDtoFactory()

        # Create a mock repository
        self.adhd_repository = AdhdRepository()
        self.adhd_service = AdhdService(self.adhd_repository)

    def test_get_adhd_records_by_child_ids_success(self):
        """Test retrieving ADHD records by child IDs successfully"""
        child = ChildFactory()
        AdhdFactory.create_batch(3, child_id=child)
        child_ids = [child.child_id]
        try:
            adhd_records = self.adhd_service.get_adhd_records_by_child_ids(child_ids)
            self.assertEqual(len(adhd_records), 3)
            for adhd_dto in adhd_records:
                self.assertIn(adhd_dto.child_id.child_id, child_ids)
        except CustomException as e:
            self.fail(f"Retrieving ADHD records failed with CustomException: {e}")

    def test_get_adhd_records_by_child_ids_no_records(self):
        """Test retrieving ADHD records for child IDs with no records"""
        empty_child_ids = [9999, 9998, 9997]
        try:
            empty_adhd_records = self.adhd_service.get_adhd_records_by_child_ids(empty_child_ids)
            self.assertEqual(len(empty_adhd_records), 0)
        except CustomException as e:
            self.fail(f"Retrieving ADHD records failed with CustomException: {e}")

    def test_create_adhd_record_success(self):
        """Test creating an ADHD record successfully"""
        try:
            created_adhd_dto = self.adhd_service.create_adhd_record_serv(self.adhd_dto)
            self.assertIsNotNone(created_adhd_dto.adhd_id)
            self.assertEqual(created_adhd_dto.perception_1, self.adhd_dto.perception_1)
            self.assertEqual(created_adhd_dto.child_id.child_id, self.adhd_dto.child_id.child_id)
        except CustomException as e:
            self.fail(f"Creating ADHD record failed with CustomException: {e}")

    def test_update_adhd_record_success(self):
        """Test updating an ADHD record successfully"""
        adhd = AdhdFactory()
        update_dto = AdhdDtoFactory(adhd_id=adhd.adhd_id, child_id=adhd.child_id)
        try:
            updated_adhd_dto = self.adhd_service.update_adhd_record_serv(update_dto)
            self.assertEqual(updated_adhd_dto.adhd_id, adhd.adhd_id)
            self.assertEqual(updated_adhd_dto.child_id.child_id, adhd.child_id.child_id)
        except CustomException as e:
            self.fail(f"ADHD record update failed with CustomException: {e}")

    def test_update_adhd_record_non_existing(self):
        """Test updating a non-existing ADHD record"""
        non_existing_adhd_dto = AdhdDtoFactory(adhd_id=9999)
        with self.assertRaises(CustomException):
            self.adhd_service.update_adhd_record_serv(non_existing_adhd_dto)


class QuestionnaireServiceTest(TestCase):

    def setUp(self):
        # Create a random Questionnaire DTO using factory_boy
        self.questionnaire_dto = QuestionnaireDtoFactory()

        # Create a random Child and DTO using factory_boy
        self.child_dto = ChildDtoFactory()
        self.child = ChildFactory()

        # Create a mock repository
        self.questionnaire_repository = QuestionnaireRepository()
        self.questionnaire_service = QuestionnaireService(self.questionnaire_repository)

    def test_get_questionnaires_by_child_ids_success(self):
        """Test retrieving questionnaires by child IDs successfully"""
        QuestionnaireFactory.create_batch(3, child_id=self.questionnaire_dto.child_id)
        child_ids = [self.questionnaire_dto.child_id.child_id]
        try:
            questionnaires = self.questionnaire_service.get_questionnaires_by_child_ids(child_ids)
            self.assertEqual(len(questionnaires), 3)
            for questionnaire_dto in questionnaires:
                self.assertIn(questionnaire_dto.child_id.child_id, child_ids)
        except CustomException as e:
            self.fail(f"Retrieving questionnaires failed with CustomException: {e}")

    def test_get_questionnaires_by_child_ids_no_records(self):
        """Test retrieving questionnaires for child IDs with no records"""
        empty_child_ids = [9999, 9998, 9997]
        try:
            empty_questionnaires = self.questionnaire_service.get_questionnaires_by_child_ids(empty_child_ids)
            self.assertEqual(len(empty_questionnaires), 0)
        except CustomException as e:
            self.fail(f"Retrieving questionnaires failed with CustomException: {e}")

    def test_create_questionnaire_success(self):
        """Test creating a questionnaire successfully"""
        try:
            created_questionnaire_dto = self.questionnaire_service.create_questionnaire_serv(self.questionnaire_dto)
            self.assertIsNotNone(created_questionnaire_dto.questionnaire_id)
            self.assertEqual(created_questionnaire_dto.child_id.child_id, self.questionnaire_dto.child_id.child_id)
        except CustomException as e:
            self.fail(f"Creating questionnaire failed with CustomException: {e}")

    def test_update_questionnaire_success(self):
        """Test updating a questionnaire successfully"""
        questionnaire = QuestionnaireFactory()
        update_dto = QuestionnaireDtoFactory(questionnaire_id=questionnaire.questionnaire_id,
                                             child_id=questionnaire.child_id)
        try:
            updated_questionnaire_dto = self.questionnaire_service.update_questionnaire_serv(update_dto)
            self.assertEqual(updated_questionnaire_dto.questionnaire_id, questionnaire.questionnaire_id)
            self.assertEqual(updated_questionnaire_dto.child_id.child_id, questionnaire.child_id.child_id)
        except CustomException as e:
            self.fail(f"Updating questionnaire failed with CustomException: {e}")

    def test_update_questionnaire_non_existing(self):
        """Test updating a non-existing questionnaire"""
        non_existing_questionnaire_dto = QuestionnaireDtoFactory(questionnaire_id=9999)
        with self.assertRaises(CustomException):
            self.questionnaire_service.update_questionnaire_serv(non_existing_questionnaire_dto)

    def test_get_questionnaire_by_child_success(self):
        """Test retrieving a questionnaire by child ID successfully"""
        # Create a Child instance
        child = ChildFactory()

        # Create a Questionnaire instance associated with the Child
        questionnaire = QuestionnaireFactory(child_id=child)

        # Create a ChildDto for the Child instance
        child_dto = ChildDtoFactory(child_id=child.child_id)

        try:
            retrieved_questionnaire_dto = self.questionnaire_service.get_questionnaire_by_child(child_dto)
            self.assertIsNotNone(retrieved_questionnaire_dto)
            self.assertEqual(retrieved_questionnaire_dto.child_id.child_id, questionnaire.child_id.child_id)
        except CustomException as e:
            self.fail(f"Retrieving questionnaire failed with CustomException: {e}")

    def test_get_questionnaire_by_child_no_records(self):
        """Test retrieving a questionnaire for a child ID with no records"""
        non_existing_child_dto = ChildDtoFactory(child_id=9999)
        with self.assertRaises(CustomException):
            self.questionnaire_service.get_questionnaire_by_child(non_existing_child_dto)
