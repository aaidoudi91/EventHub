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
    class Meta:
        model = Registration
        fields = '__all__'

    def validate(self, data):
        # Empêche la double inscription
        if Registration.objects.filter(
            event=data['event'],
            participant=data['participant']
        ).exists():
            raise serializers.ValidationError(
                "This participant is already registered for this event."
            )
        # Empêche l'inscription à un event non ouvert
        if data['event'].status != 'open':
            raise serializers.ValidationError(
                "Registrations are closed for this event."
            )
        return data


class RegistrationDetailSerializer(serializers.ModelSerializer):
    """Utilisé en lecture : affiche les objets imbriqués complets."""
    participant = ParticipantSerializer(read_only=True)
    event = EventSerializer(read_only=True)

    class Meta:
        model = Registration
        fields = '__all__'
