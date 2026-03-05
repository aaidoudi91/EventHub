from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from events.models import Event, Participant, Registration
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **kwargs):
        # Deletions are ordered to respect foreign key constraints
        self.stdout.write('Clearing existing data...')
        Registration.objects.all().delete()
        Participant.objects.all().delete()
        Event.objects.all().delete()

        # Users
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@eventhub.com', 'admin123')
            self.stdout.write('Created user: admin')
        if not User.objects.filter(username='viewer').exists():
            User.objects.create_user('viewer', 'viewer@eventhub.com', 'viewer123', is_staff=False)
            self.stdout.write('Created user: viewer')

        now = timezone.now()

        # Events: mix of upcoming (open), past (closed) and cancelled to cover all statuses
        events = Event.objects.bulk_create([
            Event(title='AI & Machine Learning Summit', description='Annual conference on the latest advances in AI and ML.', date=now + timedelta(days=10), location='Paris, France', status='open'),
            Event(title='Web Development Bootcamp', description='Intensive 2-day workshop on modern fullstack development.', date=now + timedelta(days=20), location='Lyon, France', status='open'),
            Event(title='Cloud & DevOps Conference', description='Best practices for CI/CD, Docker and Kubernetes.', date=now + timedelta(days=35), location='Bordeaux, France', status='open'),
            Event(title='Cybersecurity Forum', description='Talks on ethical hacking, threat detection and GDPR compliance.', date=now + timedelta(days=50), location='Lille, France', status='open'),
            Event(title='Data Science Meetup', description='Informal meetup for data scientists and ML engineers.', date=now - timedelta(days=5), location='Paris, France', status='closed'),
            Event(title='UX Design Workshop', description='Hands-on workshop on user research and prototyping.', date=now - timedelta(days=15), location='Nantes, France', status='cancelled'),
        ])

        # Participants
        participants = Participant.objects.bulk_create([
            Participant(first_name='Alice', last_name='Martin', email='alice.martin@email.com', phone='0612345678'),
            Participant(first_name='Bob', last_name='Dupont', email='bob.dupont@email.com', phone='0623456789'),
            Participant(first_name='Clara', last_name='Bernard', email='clara.bernard@email.com', phone='0634567890'),
            Participant(first_name='David', last_name='Leclerc', email='david.leclerc@email.com', phone='0645678901'),
            Participant(first_name='Emma', last_name='Rousseau', email='emma.rousseau@email.com', phone='0656789012'),
            Participant(first_name='François', last_name='Petit', email='francois.petit@email.com', phone='0667890123'),
            Participant(first_name='Grace', last_name='Moreau', email='grace.moreau@email.com', phone='0678901234'),
            Participant(first_name='Hugo', last_name='Simon', email='hugo.simon@email.com', phone='0689012345'),
        ])

        # Registrations: each open event has between 2 and 4 participants
        registrations = [
            (events[0], participants[0]),
            (events[0], participants[1]),
            (events[0], participants[2]),
            (events[0], participants[3]),
            (events[1], participants[0]),
            (events[1], participants[4]),
            (events[1], participants[5]),
            (events[2], participants[1]),
            (events[2], participants[6]),
            (events[3], participants[2]),
            (events[3], participants[7]),
            (events[3], participants[3]),
        ]

        for event, participant in registrations:
            Registration.objects.create(event=event, participant=participant)

        self.stdout.write(self.style.SUCCESS(
            f'\nDone! Seeded: {len(events)} events, {len(participants)} participants, {len(registrations)} registrations.'
        ))
