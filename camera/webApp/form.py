from django import forms
from . import models
from datetime import datetime


class loginForm(forms.Form):
    username = forms.CharField(
        widget=forms.TextInput(attrs={
            'type': 'text',
            'title': 'Username',
            'id': 'username',
            'name': 'username',
            'placeholder': 'user',
            'autocomplete': 'off',
            'maxlength': '255',
            'tabindex': '1',
            'style': 'width: 300',
        }),

    )
    password = forms.CharField(
        widget=forms.TextInput(attrs={
            'title': 'Password',
            'id': 'password',
            'name': 'password',
            'placeholder': 'Password',
            'autocomplete': 'off',
            'maxlength': '50',
            'tabindex': '2',
            'type': 'password',
            'style': 'width: 300',

        })
    )

