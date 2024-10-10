from django.db import models


class Child(models.Model):
    child_id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    parent_id = models.ForeignKey('User', db_column="parent_id", on_delete=models.CASCADE,
                                  related_name='children_of_parent')
    clinician_id = models.ForeignKey('User', db_column="clinician_id", on_delete=models.SET_NULL, null=True, blank=True,
                                     related_name='children_of_clinician')

    class Meta:
        db_table = 'child'  # Explicitly specify the table name

    def __str__(self):
        return f"{self.first_name} {self.last_name} (Child ID: {self.child_id})"
