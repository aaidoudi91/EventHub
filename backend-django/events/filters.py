import django_filters
from .models import Event

class EventFilter(django_filters.FilterSet):
    date_from = django_filters.DateTimeFilter(field_name='date', lookup_expr='gte')
    date_to = django_filters.DateTimeFilter(field_name='date', lookup_expr='lte')

    class Meta:
        model = Event
        fields = ['status', 'date_from', 'date_to']
