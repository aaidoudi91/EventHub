from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Event, Participant, Registration
from .serializers import (
    EventSerializer, ParticipantSerializer,
    RegistrationSerializer, RegistrationDetailSerializer
)
from .permissions import IsAdminOrReadOnly
from .filters import EventFilter


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = EventFilter


class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all().order_by('last_name')
    serializer_class = ParticipantSerializer
    permission_classes = [IsAdminOrReadOnly]


class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all().select_related('event', 'participant')
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return RegistrationDetailSerializer
        return RegistrationSerializer
