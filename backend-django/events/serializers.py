from rest_framework import serializers
from .models import Event, Participant, Registration


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'


class RegistrationSerializer(serializers.ModelSerializer):
    """Used for write operations — expects event and participant IDs."""

    class Meta:
        model = Registration
        fields = '__all__'

    def validate(self, data):
        # Prevent duplicate registrations before the database constraint is reached
        if Registration.objects.filter(
                event=data['event'],
                participant=data['participant']
        ).exists():
            raise serializers.ValidationError(
                "This participant is already registered for this event."
            )
        # Registrations are only allowed for open events
        if data['event'].status != 'open':
            raise serializers.ValidationError(
                "Registrations are closed for this event."
            )
        return data


class RegistrationDetailSerializer(serializers.ModelSerializer):
    """Used for read operations — nests full Event and Participant objects."""

    participant = ParticipantSerializer(read_only=True)
    event = EventSerializer(read_only=True)

    class Meta:
        model = Registration
        fields = '__all__'
