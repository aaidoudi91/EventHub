from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """ Extends the default JWT serializer to include the user's is_staff field in the token payload, allowing the
    frontend to determine the user's role without making an additional API call after login. """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_staff'] = user.is_staff
        return token
