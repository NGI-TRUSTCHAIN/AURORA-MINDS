from django.db import models


class Adhd(models.Model):
    adhd_id = models.IntegerField(primary_key=True)
    perception_1 = models.DecimalField(max_digits=12, decimal_places=1)  # e.g., 12345678901.5
    fine_motor = models.DecimalField(max_digits=12, decimal_places=1)
    pre_writing = models.DecimalField(max_digits=12, decimal_places=1)
    visual_motor_integration = models.DecimalField(max_digits=12, decimal_places=8)  # e.g., 12345.67890123
    spatial_orientation = models.DecimalField(max_digits=12, decimal_places=1)
    perception_2 = models.DecimalField(max_digits=12, decimal_places=1)
    cognitive_flexibility = models.DecimalField(max_digits=12, decimal_places=1)
    attention_deficit = models.DecimalField(max_digits=12, decimal_places=1)
    sustained_attention = models.DecimalField(max_digits=12, decimal_places=1)
    target = models.DecimalField(max_digits=12, decimal_places=1)
    # db_column --> prevent Django to add extra index '_id' in the query
    child_id = models.ForeignKey('Child', db_column="child_id", on_delete=models.CASCADE)

    class Meta:
        db_table = 'adhd'

    def __str__(self):
        return f"ADHD Record for Child ID: {self.child_id}"
