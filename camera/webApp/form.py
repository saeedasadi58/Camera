import unicodedata
from django import forms
from django.contrib.auth import authenticate, get_user_model, password_validation
from django.contrib.auth.hashers import UNUSABLE_PASSWORD_PREFIX, identify_hasher
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ValidationError
from django.core.mail import EmailMultiAlternatives
from django.template import loader
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.text import capfirst
from django.utils.translation import gettext
from django.utils.translation import gettext_lazy as _

UserModel = get_user_model()


class SettingsForm(forms.Form):
    samplingTime = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control col-xl-1',
            "type": "number",
            "value": 0,
        })
    )
    processedSeparately = forms.BooleanField(required=False)
    processPerSeconds = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control col-xl-2',
            "type": "number",
            "value": 0,
        })
    )
    calibration = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control col-xl-2',
            "type": "number",
            "value": 0,
        })
    )
    CHOICES = [('evaluatedDirectly', 'نتایج مستقیما ارزیابی شود'),
               ('evaluatedAutomatically', 'نتایج به صورت خودکار توسط تاریخ توزیع تخمین زده شود'),
               ('evaluatedExperimental', 'نتایج بر اساس تجربی توسط تابع توزیع تخمین زده شود')]
    evaluated = forms.CharField(label='Gender', widget=forms.RadioSelect(choices=CHOICES))

    coefficient_N = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control col-xl-4',
            "type": "number",
            "value": 0,
        })
    )
    coefficient_X = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control col-xl-4',
            "type": "number",
            "value": 0,
        })
    )
    separationAlgorithm = forms.BooleanField(required=False)
    ExposureTime = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control col-xl-3',
            "type": "number",
            "value": 0,
        })
    )
    Gain = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control col-xl-3',
            "type": "number",
            "value": 0,
        })
    )
    Width = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control col-xl-3',
            "type": "number",
            "value": 0,
        })
    )
    Height = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control col-xl-3',
            "type": "number",
            "value": 0,
        })
    )
    FrameRate = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control col-xl-3',
            "type": "number",
            "value": 0,
        })
    )
    PixelFormat = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control col-xl-3',
            "type": "text",
            "value": "RGB8",
        })
    )
    AutoWhiteBalance = forms.BooleanField(required=False)

    ColorBalanceRed = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control col-xl-3',
            "type": "number",
            "value": 0,
        })
    )
    ColorBalanceBlue = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control col-xl-3',
            "type": "number",
            "value": 0,
        })
    )
class UsernameField(forms.CharField):
    def to_python(self, value):
        return unicodedata.normalize("NFKC", super().to_python(value))

    def widget_attrs(self, widget):
        return {
            **super().widget_attrs(widget),
            "autocapitalize": "none",
            "autocomplete": "username",
        }


class loginForm(forms.Form):
    """
    Base class for authenticating users. Extend this to get a form that accepts
    username/password logins.
    """

    username = UsernameField(widget=forms.TextInput(attrs={
        'type': 'text',
        'title': 'Username',
        'id': 'username',
        'name': 'username',
        'placeholder': 'user',
        'autocomplete': 'off',
        'maxlength': '255',
        'tabindex': '1',
        'style': 'width: 300',
    }))
    password = forms.CharField(
        label=_("Password"),
        strip=False,
        widget=forms.PasswordInput(attrs={
            'title': 'Password',
            'id': 'password',
            'name': 'password',
            'placeholder': 'Password',
            'autocomplete': 'off',
            'maxlength': '50',
            'tabindex': '2',
            'type': 'password',
            'style': 'width: 300',

        }),
    )

    error_messages = {
        "invalid_login": _(
            "Please enter a correct username and password. Note that both "
            "fields may be case-sensitive."
        ),
        "inactive": _("This account is inactive."),
    }

    def __init__(self, request=None, *args, **kwargs):
        """
        The 'request' parameter is set for custom auth use by subclasses.
        The form data comes in via the standard 'data' kwarg.
        """
        self.request = request
        self.user_cache = None
        super().__init__(*args, **kwargs)

        # Set the max length and label for the "username" field.
        self.username_field = UserModel._meta.get_field(UserModel.USERNAME_FIELD)
        username_max_length = self.username_field.max_length or 254
        self.fields["username"].max_length = username_max_length
        self.fields["username"].widget.attrs["maxlength"] = username_max_length
        if self.fields["username"].label is None:
            self.fields["username"].label = capfirst(self.username_field.verbose_name)

    def clean(self):
        username = self.cleaned_data.get("username")
        password = self.cleaned_data.get("password")

        if username is not None and password:
            self.user_cache = authenticate(
                self.request, username=username, password=password
            )
            if self.user_cache is None:
                raise self.get_invalid_login_error()
            else:
                self.confirm_login_allowed(self.user_cache)

        return self.cleaned_data

    def confirm_login_allowed(self, user):
        """
        Controls whether the given User may log in. This is a policy setting,
        independent of end-user authentication. This default behavior is to
        allow login by active users, and reject login by inactive users.

        If the given user cannot log in, this method should raise a
        ``ValidationError``.

        If the given user may log in, this method should return None.
        """
        if not user.is_active:
            raise ValidationError(
                self.error_messages["inactive"],
                code="inactive",
            )

    def get_user(self):
        return self.user_cache

    def get_invalid_login_error(self):
        return ValidationError(
            self.error_messages["invalid_login"],
            code="invalid_login",
            params={"username": self.username_field.verbose_name},
        )
