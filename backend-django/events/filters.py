import django_filters
from .models import Event


class EventFilter(django_filters.FilterSet):
    # Optional date range filters: ?date_from=...&date_to=...
    date_from = django_filters.DateTimeFilter(field_name='date', lookup_expr='gte')
    date_to = django_filters.DateTimeFilter(field_name='date', lookup_expr='lte')

    class Meta:
        model = Event
        # 'status' uses exact match; date_from and date_to are declared above
        fields = ['status', 'date_from', 'date_to']
