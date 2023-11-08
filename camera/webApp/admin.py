from django.contrib import admin
from webApp.models import Camera, User, Proccess, ProccessInfo

from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib.auth.models import Permission, Group
from .models import User
from django.db.models import Q
from django.utils.html import strip_tags

class UserCreationForm(forms.ModelForm):
    # A form for creating new users. Includes all the required
    # fields, plus a repeated password.
    password1 = forms.CharField(label='رمز عبور', widget=forms.PasswordInput)
    password2 = forms.CharField(label='تکرار رمز عبور', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('username', 'user_id')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])

        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    # A form for updating users. Includes all the fields on
    # the user, but replaces the password field with admin's
    # password hash display field.

    password = ReadOnlyPasswordHashField(label="Password",
                                         help_text="رمزهای عبور خالی ذخیره نمی شوند، بنابراین هیچ راهی برای دیدن وجود ندارد "
                                                   "اما شما میتوانید رمز عبور کاربر را در  "
                                                   " <a href=\"../password/\">این صفحه تغییر دهید</a>.")

    def has_superuser_perm(request, obj=None):
        if request.user.is_superuser:
            return True
        return False

    # @csrf_protect

    class Meta:
        model = User
        fields = ('username', 'user_id', 'password', 'is_active', 'is_staff', 'description')

    def __init__(self, *args, **kwargs):
        super(UserChangeForm, self).__init__(*args, **kwargs)

        f = self.fields.get('user_permissions', None)

        if f is not None:
            f.queryset = f.queryset.select_related('content_type')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    def get_queryset(self, request):
        qs = super(UserAdmin, self).get_queryset(request)
        groups_name = []
        for group in request.user.groups.all():
            groups_name.append(str(group))

        if request.user.is_superuser:
            return qs
        # elif 'حلزون' in groups_name:
        #     return User.objects.filter(groups__name='حلزون')

        else:
            for i, item in enumerate(groups_name):
                if item == 'مدیریت':
                    del groups_name[i]

            search_creator = Q(created_by=request.user)
            search_teammate = Q(groups__name__in=groups_name)
            qs = qs.filter(search_creator | search_teammate).distinct()

        return qs

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = (
        'username', 'is_active', 'is_staff', 'is_superuser', 'custom_group', 'desc', 'fullname', 'created_by')
    list_filter = ('username',) + ('groups__name',)
    fieldsets = (
        (None, {'fields': ('username', 'user_id', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
        ('Personal info', {'fields': ('avatar', 'mobile')}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'fullname', 'user_id', 'password1', 'password2', 'description')}
         ),
    )
    search_fields = ('username',)
    ordering = ('username',)
    filter_horizontal = ()

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "groups":
            user = request.user
            if user.is_superuser:
                queryset = Group.objects
            else:
                queryset = user.groups.exclude(name='مدیریت')
            kwargs["queryset"] = queryset
        # if db_field.name == "user_permissions":
        #     user = request.user
        #     if user.is_superuser:
        #         queryset = Permission.objects
        #     else:
        #         queryset = user.user_permissions
        #     kwargs["queryset"] = queryset
        return super(UserAdmin, self).formfield_for_manytomany(db_field, request, **kwargs)

    def change_view(self, request, object_id):
        # we want to limit the ability of the normal user to edit permissions.
        if request.user.is_superuser:
            self.fieldsets = (
                (None, {'fields': ('username', 'password')}),
                ('Personal info', {'fields': ('fullname', 'avatar', 'description')}),
                ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions')}),
                ('Important dates', {'fields': ('last_login',)}),
                ('Groups', {'fields': ('groups',)}),
            )
        else:
            self.fieldsets = (
                (None, {'fields': ('username', 'password')}),
                ('Personal info', {'fields': ('description',)}),
                ('Permissions', {'fields': ('is_active', 'is_staff')}),
                ('Important dates', {'fields': ('last_login',)}),
                ('Groups', {'fields': ('groups',)}),
            )

        return super(UserAdmin, self).change_view(request, object_id, )

    def custom_group(self, obj):

        """
        get group, separate by comma, and display empty string if user has no group
        """
        return ','.join([g.name for g in obj.groups.all()]) if obj.groups.count() else '-'

    def desc(self, obj):
        return strip_tags(obj.description) if obj.description else '-'

    custom_group.short_description = 'دسترسی ها'
    desc.short_description = 'توضیحات'


# Register your models here.
admin.site.register(Camera)
admin.site.register(User)
admin.site.register(Proccess)
admin.site.register(ProccessInfo)
