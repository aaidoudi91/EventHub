from django.db import models


class Event(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('cancelled', 'Cancelled'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.DateTimeField()
    location = models.CharField(max_length=200)
    # Status drives business logic: registrations are only allowed for open events
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Participant(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    # Uniqueness enforced at the database level to prevent duplicate profiles
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Registration(models.Model):
    """
    Explicit join model for the many-to-many relationship between Event and Participant.
    Using a dedicated model rather than ManyToManyField makes registrations a
    first-class API resource that can be listed, created and deleted independently.
    """
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='registrations')
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Database-level guarantee that a participant cannot register twice for the same event
        unique_together = ('event', 'participant')

    def __str__(self):
        return f"{self.participant} → {self.event}"
