# Copyright (C) 2021-2022 Intel Corporation
# Copyright (C) 2022-2023 CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT
import functools
import hashlib

from django.utils.functional import SimpleLazyObject
from django.utils import timezone
from django.http import Http404, HttpResponseBadRequest, HttpResponseRedirect
from rest_framework import views, serializers, status
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.http import etag as django_etag
from rest_framework.response import Response
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LogoutView
from dj_rest_auth.views import LoginView
from allauth.account import app_settings as allauth_settings
from allauth.account.views import ConfirmEmailView
from allauth.account.utils import has_verified_email, send_email_confirmation
from datetime import datetime, timedelta
import django.core.serializers

from furl import furl

from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiResponse, extend_schema, inline_serializer, extend_schema_view
from drf_spectacular.contrib.rest_auth import get_token_serializer_class
from django.utils.decorators import method_decorator

from cvat.apps.iam.serializers import UserDetailSerializer
from .models import UserDetail

from .authentication import Signer
from cvat.apps.iam.models import UserSession

def get_organization(request):
    from cvat.apps.organizations.models import Organization

    IAM_ROLES = {role: priority for priority, role in enumerate(settings.IAM_ROLES)}
    groups = list(request.user.groups.filter(name__in=list(IAM_ROLES.keys())))
    groups.sort(key=lambda group: IAM_ROLES[group.name])
    privilege = groups[0] if groups else None

    organization = None

    try:
        org_slug = request.GET.get('org')
        org_id = request.GET.get('org_id')
        org_header = request.headers.get('X-Organization')

        if org_id is not None and (org_slug is not None or org_header is not None):
            raise ValidationError('You cannot specify "org_id" query parameter with '
                '"org" query parameter or "X-Organization" HTTP header at the same time.')

        if org_slug is not None and org_header is not None and org_slug != org_header:
            raise ValidationError('You cannot specify "org" query parameter and '
                '"X-Organization" HTTP header with different values.')

        org_slug = org_slug if org_slug is not None else org_header

        if org_slug:
            organization = Organization.objects.get(slug=org_slug)
        elif org_id:
            organization = Organization.objects.get(id=int(org_id))
    except Organization.DoesNotExist:
        raise NotFound(f'{org_slug or org_id} organization does not exist.')

    context = {
        "organization": organization,
        "privilege": getattr(privilege, 'name', None)
    }

    return context

class ContextMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        # https://stackoverflow.com/questions/26240832/django-and-middleware-which-uses-request-user-is-always-anonymous
        request.iam_context = SimpleLazyObject(lambda: get_organization(request))

        return self.get_response(request)

@extend_schema(tags=['auth'])
@extend_schema_view(post=extend_schema(
    summary='This method signs URL for access to the server',
    description='Signed URL contains a token which authenticates a user on the server.'
                'Signed URL is valid during 30 seconds since signing.',
    request=inline_serializer(
        name='Signing',
        fields={
            'url': serializers.CharField(),
        }
    ),
    responses={'200': OpenApiResponse(response=OpenApiTypes.STR, description='text URL')}))
class SigningView(views.APIView):

    def post(self, request):
        url = request.data.get('url')
        if not url:
            raise ValidationError('Please provide `url` parameter')

        signer = Signer()
        url = self.request.build_absolute_uri(url)
        sign = signer.sign(self.request.user, url)

        url = furl(url).add({Signer.QUERY_PARAM: sign}).url
        return Response(url)

class LoginViewEx(LoginView):
    """
    Check the credentials and return the REST Token
    if the credentials are valid and authenticated.
    If email verification is enabled and the user has the unverified email,
    an email with a confirmation link will be sent.
    Calls Django Auth login method to register User ID
    in Django session framework.

    Accept the following POST parameters: username, email, password
    Return the REST Framework Token Object's key.
    """
    @extend_schema(responses=get_token_serializer_class())
    def post(self, request, *args, **kwargs):
        self.request = request
        self.serializer = self.get_serializer(data=self.request.data)
        try:
            self.serializer.is_valid(raise_exception=True)
        except ValidationError:
            user = self.serializer.get_auth_user(
                self.serializer.data.get('username'),
                self.serializer.data.get('email'),
                self.serializer.data.get('password')
            )
            if not user:
                raise

            # Check that user's email is verified.
            # If not, send a verification email.
            if not has_verified_email(user):
                send_email_confirmation(request, user)
                # we cannot use redirect to ACCOUNT_EMAIL_VERIFICATION_SENT_REDIRECT_URL here
                # because redirect will make a POST request and we'll get a 404 code
                # (although in the browser request method will be displayed like GET)
                return HttpResponseBadRequest('Unverified email')
        except Exception: # nosec
            pass

        self.login()
        user = self.serializer.get_auth_user(
                self.serializer.data.get('username'),
                self.serializer.data.get('email'),
                self.serializer.data.get('password')
            )
        data = self.get_serializer(user).data
        username = data.get('username')

        UserSession.objects.create(
            user=user,
            username=username,
            login_time=timezone.now(),
            logout_time=None,
            comments='login'
        )
        response = self.get_response()
        key = response.data.get('key')

        try:
            token, created = Token.objects.get_or_create(user=user)
            if created:
                token.key = key
                token.created = timezone.now()
                token.save()
        except:
            pass
        # key = data.get('key')
        return Response(response.data)

class RegisterViewEx(RegisterView):
    def get_response_data(self, user):
        data = self.get_serializer(user).data
        data['email_verification_required'] = True
        data['key'] = None

        UserSession.objects.create(
            user=user,
            username=data.get('username'),
            login_time=timezone.now(),
            comments='register'
        )

        if allauth_settings.EMAIL_VERIFICATION != \
            allauth_settings.EmailVerificationMethod.MANDATORY:
            data['email_verification_required'] = False
            data['key'] = user.auth_token.key

        try:
            token, created = Token.objects.get_or_create(user=user)
            if created:
                token.key = data['key']
                token.created = timezone.now()
                token.save()
        except:
            pass

        category = self.request.data.get('category')
        data['category'] = category.lower()
        return data

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = self.get_response_data(user)

        category = serializer.validated_data.get('category')
        if category:
            user_detail = UserDetail.objects.create(
                category=category.upper(),
                user=user
            )
        else:
            raise ValidationError('Please provide `url` parameter')

        if data:
            response = Response(
                data,
                status=status.HTTP_201_CREATED,
                headers=headers,
            )
        else:
            response = Response(status=status.HTTP_204_NO_CONTENT, headers=headers)

        return response


class LogoutViewEx(LogoutView):
    def logout(self, request):
        auth_header = request.headers.get('Authorization')
        token = ""

        if auth_header and auth_header.startswith('Token '):
            token = auth_header.split(' ')[1]

        try:
            if token:
                user_token = Token.objects.select_related('user').get(key=token)
                user = user_token.user

                response = super().logout(request)

                try:
                    user_session = UserSession.objects.filter(user=user, logout_time__isnull=True).earliest('login_time')
                    user_session.logout_time = timezone.now()
                    user_session.save()

                except UserSession.DoesNotExist:
                    pass
                return Response(response.data)
        except Token.DoesNotExist:
            return Response("Request Unauthorized")
            pass

class UserDetailUpdateView(views.APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, format=None):
        auth_header = request.headers.get('Authorization')
        token = ""

        if auth_header and auth_header.startswith('Token '):
            token = auth_header.split(' ')[1]

        if not token:
            raise ValidationError('Unauthorized Request')

        try:
            user_token = Token.objects.select_related('user').get(key=token)
            user = user_token.user

            user_detail = UserDetail.objects.filter(user=user).first()
            serializer = UserDetailSerializer(
                user_detail, data=request.data, partial=True
            )

            if serializer.is_valid():
                serializer.save()
                response = serializer.data
                del response["user"]
                del response["id"]
                return Response(response)

            raise ValidationError(serializer.errors)
        except Token.DoesNotExist:
            raise ValidationError('Unauthorized Request')

class UserSessionsView(views.APIView):
    serializer_class = None
    permission_classes = [AllowAny]
    authentication_classes = []
    iam_organization_field = None

    def post (self, request, format=None):
        duration = request.data.get('duration')

        if duration is None:
            return Response({"duration": "This field is required"})

        now = datetime.now()
        start_time = now - timedelta(days=int(duration))

        user_sessions = UserSession.objects.filter(login_time__gte=start_time).order_by('login_time')

        data = []
        for user_session in user_sessions:
            data.append({
                'username': user_session.username,
                'login_time': user_session.login_time,
                'logout_time': user_session.logout_time,
                'session_duration': user_session.session_duration,
                'comments': user_session.comments,
            })

        # Return the serialized data as a JSON response
        return Response(data)


def _etag(etag_func):
    """
    Decorator to support conditional retrieval (or change)
    for a Django Rest Framework's ViewSet.
    It calls Django's original decorator but pass correct request object to it.
    Django's original decorator doesn't work with DRF request object.
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(obj_self, request, *args, **kwargs):
            drf_request = request
            wsgi_request = request._request

            @django_etag(etag_func=etag_func)
            def patched_viewset_method(*_args, **_kwargs):
                """Call original viewset method with correct type of request"""
                return func(obj_self, drf_request, *args, **kwargs)

            return patched_viewset_method(wsgi_request, *args, **kwargs)
        return wrapper
    return decorator

class RulesView(views.APIView):
    serializer_class = None
    permission_classes = [AllowAny]
    authentication_classes = []
    iam_organization_field = None

    @staticmethod
    def _get_bundle_path():
        return settings.IAM_OPA_BUNDLE_PATH

    @staticmethod
    def _etag_func(file_path):
        with open(file_path, 'rb') as f:
            return hashlib.blake2b(f.read()).hexdigest()

    @_etag(lambda _: RulesView._etag_func(RulesView._get_bundle_path()))
    def get(self, request):
        file_obj = open(self._get_bundle_path() ,"rb")
        return HttpResponse(file_obj, content_type='application/x-tar')

class ConfirmEmailViewEx(ConfirmEmailView):
    template_name = 'account/email/email_confirmation_signup_message.html'

    def get(self, *args, **kwargs):
        try:
            if not allauth_settings.CONFIRM_EMAIL_ON_GET:
                return super().get(*args, **kwargs)
            return self.post(*args, **kwargs)
        except Http404:
            return HttpResponseRedirect(settings.INCORRECT_EMAIL_CONFIRMATION_URL)
