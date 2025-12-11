from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserActivity, UserNotification


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    firstName = serializers.CharField(source='first_name', read_only=True)
    lastName = serializers.CharField(source='last_name', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'firstName', 'lastName', 'first_name', 'last_name',
            'phone', 'location', 'department', 'position', 'join_date', 
            'bio', 'avatar', 'role', 'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'write_only': True},
            'last_name': {'write_only': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'firstName', 'lastName', 
            'phone', 'location', 'department', 'position', 'join_date', 
            'bio', 'avatar', 'role'
        ]
        read_only_fields = ['id', 'username', 'email']


class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ['id', 'type', 'title', 'timestamp']


class UserNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotification
        fields = ['id', 'title', 'timestamp', 'read']


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Unable to login with provided credentials.')
        else:
            raise serializers.ValidationError('Must include email and password.')
        
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 
            'password', 'password_confirm'
        ]
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return data
    
    def create(self, validated_data):
        print("Creating user with data:", validated_data)  # Debug print
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        try:
            user = User.objects.create_user(**validated_data)
            user.set_password(password)
            user.save()
            print("User created successfully:", user)  # Debug print
            return user
        except Exception as e:
            print("Error creating user:", str(e))  # Debug print
            raise serializers.ValidationError(f"Error creating user: {str(e)}")
