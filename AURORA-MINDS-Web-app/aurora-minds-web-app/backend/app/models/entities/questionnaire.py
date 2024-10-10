from django.db import models


class Questionnaire(models.Model):
    questionnaire_id = models.AutoField(primary_key=True)
    gender = models.CharField(max_length=255)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    height = models.DecimalField(max_digits=5, decimal_places=2)
    date_of_birth = models.DateField()
    is_native_greek_language = models.BooleanField()
    place_of_residence = models.CharField(max_length=255)
    regional_unit = models.CharField(max_length=255)
    school_name = models.CharField(max_length=255)
    school_grade = models.CharField(max_length=255)
    school_class_section = models.CharField(max_length=255)
    has_parent_fully_custody = models.BooleanField()
    comments = models.TextField(null=True, blank=True)
    has_hearing_problem = models.BooleanField()
    has_vision_problem = models.BooleanField()
    has_early_learning_difficulties = models.BooleanField()
    has_delayed_development = models.BooleanField()
    has_autism = models.BooleanField()
    has_deprivation_neglect = models.BooleanField()
    has_childhood_aphasia = models.BooleanField()
    has_intellectual_disability = models.BooleanField()
    child_id = models.ForeignKey('Child', db_column="child_id", on_delete=models.CASCADE)

    class Meta:
        db_table = 'questionnaire'

    def __str__(self):
        return f"Questionnaire for Child ID: {self.child_id}"
