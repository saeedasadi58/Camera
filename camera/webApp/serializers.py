from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import User,Camera


class UserCrateSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(allow_blank=False, write_only=True)

    def validate(self, data):
        """
       Checks to be sure that the received password and confirm_password
       fields are exactly the same
       """
        if data['password'] != data.pop('password2'):
            raise serializers.ValidationError('Please enter the password carefully ')
        return data

    def create(self, validated_data,request):
        """
       create user if validation is success
       """
        password = validated_data.pop('password', None)
        user = self.Meta.model(**validated_data)
        user.set_password(password)
        user.save()
        return user

    class Meta:
        model = User
        fields = ['username', 'mobile', 'password', 'password2']
        extra_kwargs = {"password": {"write_only": True}}

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'mobile']

    def get_user(self, obj):
        return str(obj.username)

class AccountSerializer(serializers.ModelSerializer):
    # password = serializers.CharField(write_only=True, required=False)
    # password2 = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('avatar', 'mobile','username','password')
        # read_only_fields = ('created_at', 'updated_at',)

        def create(self, validated_data):
            return User.objects.create(**validated_data)

        def update(self, instance, validated_data):
            instance.username = validated_data.get('username', instance.username)
            instance.tagline = validated_data.get('tagline', instance.tagline)
            instance.avatar = validated_data.get('avatar', instance.avatar)
            instance.mobile = validated_data.get('mobile', instance.mobile)
            # instance.crits_key = validated_data.get('crits_key', instance.crits_key)

            instance.save()

            # password = validated_data.get('password', None)
            # confirm_password = validated_data.get('password2', None)

            # if password and confirm_password and password == confirm_password:
            #     instance.set_password(password)
            #     instance.save()

            update_session_auth_hash(self.context.get('request'), instance)

            return instance

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(allow_blank=False, write_only=True)

    def validate(self, data):
        """
       Checks to be sure that the received password and confirm_password
       fields are exactly the same
       """
        if data['new_password'] != data.pop('confirm_password'):
            raise serializers.ValidationError('new password is not match with confirm password')
        return data

class CameraSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    region_name = serializers.CharField(required=False)
    city_name = serializers.CharField(required=False)
    latitude = serializers.CharField(required=False)
    longitude = serializers.CharField(required=False)
    def create(self, validated_data):
        """
        Create and return a new `Camera` instance, given the validated data.
        """
        return Camera.objects.create(**validated_data)
    def get(self):
        return HttpResponse("ok")

class UserSerializerCsfPermission(ModelSerializer):
    class Meta:
        model = User
        fields = ('id','fullname','username')

        from django.contrib.auth.models import User, Group
        from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']

# class GroupSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = Group
#         fields = ['url', 'name']