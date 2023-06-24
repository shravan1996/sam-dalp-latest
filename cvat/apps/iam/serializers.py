# Copyright (C) 2022 Intel Corporation
# Copyright (C) 2022-2023 CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import PasswordResetSerializer, LoginSerializer
from rest_framework.exceptions import ValidationError
from django.core.validators import RegexValidator
from rest_framework import serializers
from allauth.account import app_settings
from allauth.account.utils import filter_users_by_email
from django.core.validators import EmailValidator
from cvat.apps.iam.models import UserDetail

from django.conf import settings

from cvat.apps.iam.forms import ResetPasswordFormEx
import re

class UserDetailSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    def get_username(self, obj):
        return obj.username()

    def get_email(self, obj):
        return obj.email()

    def get_first_name(self, obj):
        return obj.first_name()

    def get_last_name(self, obj):
        return obj.last_name()

    category = serializers.CharField(read_only=True)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    district = serializers.CharField(required=False, allow_blank=True)
    dob = serializers.DateField(required=False)
    gender = serializers.CharField(required=False, allow_blank=True)
    primary_language = serializers.CharField(required=False, allow_blank=True)
    english_proficiency = serializers.CharField(required=False, allow_blank=True)
    education = serializers.CharField(required=False, allow_blank=True)
    prior_experience = serializers.ListField(child=serializers.CharField(), allow_empty=True, required=False)

    class Meta:
        model = UserDetail
        fields = '__all__'

    def validate_category(self, category):
        valid_categories = ['ANNOTATOR', 'PROJECT MANAGER']
        if category.upper() not in valid_categories:
            raise serializers.ValidationError('Invalid category')
        return category

    def validate_mobile_number(self, value):
        if value and not re.match(r'^[6-9]\d{9}$', value):
            raise serializers.ValidationError('Invalid Mobile. Must Contain 10 Digits And Start With 6-9')
        return value

    def validate_zipcode(self, value):
        if value and not re.match(r'^[1-9]\d{5}$', value):
            raise serializers.ValidationError('Invalid Zipcode')
        return value

    def validate_prior_experience(self, value):
        if value and 'none' in value and len(value) > 1:
            raise serializers.ValidationError('Only Option `None` Can Be Selected.')
        return value

class RegisterSerializerEx(RegisterSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    category = serializers.CharField(required=True, write_only=True)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data.update({
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
        })

        return data

    def validate_category(self, category):
        valid_categories = ['ANNOTATOR', 'PROJECT MANAGER']
        if category.upper() not in valid_categories:
            raise serializers.ValidationError('Invalid category')
        return category

class PasswordResetSerializerEx(PasswordResetSerializer):
    @property
    def password_reset_form_class(self):
        return ResetPasswordFormEx

    def get_email_options(self):
        domain = None
        if hasattr(settings, 'UI_HOST') and settings.UI_HOST:
            domain = settings.UI_HOST
            if hasattr(settings, 'UI_PORT') and settings.UI_PORT:
                domain += ':{}'.format(settings.UI_PORT)
        return {
            'domain_override': domain
        }

class LoginSerializerEx(LoginSerializer):
    def get_auth_user_using_allauth(self, username, email, password):

        def is_email_authentication():
            return settings.ACCOUNT_AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.EMAIL

        def is_username_authentication():
            return settings.ACCOUNT_AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.USERNAME

        # check that the server settings match the request
        if is_username_authentication() and not username and email:
            raise ValidationError(
                'Attempt to authenticate with email/password. '
                'But username/password are used for authentication on the server. '
                'Please check your server configuration ACCOUNT_AUTHENTICATION_METHOD.')

        if is_email_authentication() and not email and username:
            raise ValidationError(
                'Attempt to authenticate with username/password. '
                'But email/password are used for authentication on the server. '
                'Please check your server configuration ACCOUNT_AUTHENTICATION_METHOD.')

        # Authentication through email
        if settings.ACCOUNT_AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.EMAIL:
            return self._validate_email(email, password)

        # Authentication through username
        if settings.ACCOUNT_AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.USERNAME:
            return self._validate_username(username, password)

        # Authentication through either username or email
        if email:
            users = filter_users_by_email(email)
            if not users or len(users) > 1:
                raise ValidationError('Unable to login with provided credentials')

        return self._validate_username_email(username, email, password)
