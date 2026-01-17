from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'}) 
    # This statement means that the password
    # is only writable using only the post/put http methods
    # i.e., we cannot retrieve or access the password
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        
    def create(self, validated_data):
        # user = User.objects.create_user(**validated_data);
        # here, we can also write above statement as below, where validated_data is a keywordArg of type 'dict'
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        # User.objects.create = save password in a plain text
        # User.objects.create_user = automatically hash the password
        
        return user