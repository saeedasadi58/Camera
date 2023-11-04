from django.db import models

# Create your models here.
from django.core.validators import RegexValidator
from django.db import models
from django.contrib.auth.models import PermissionsMixin, Permission
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.translation import gettext_lazy as _
from django_currentuser.db.models import CurrentUserField
from ckeditor_uploader.fields import RichTextUploadingField

from .managers import UserManager


def avatar_path(instance, filename):
    return 'images/{username}/{filename}'.format(
        username=instance.username, filename=filename)


class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.CharField(_('شناسه پرسنل'), max_length=30, unique=True, blank=True, null=True)
    username = models.CharField(_('نام کاربری'), max_length=30, unique=True, blank=True, null=True)
    fullname = models.CharField(_('نام و نام خانوادگی'), max_length=30)
    description = RichTextUploadingField(blank=True, null=True, verbose_name='توضیحات')
    mobile_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$',
                                  message="Phone number must be entered in the format: '09111111111'.")
    mobile = models.CharField(verbose_name='شماره همراه', validators=[mobile_regex], max_length=11, blank=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    is_active = models.BooleanField(_('فعال'), default=True)
    is_staff = models.BooleanField(_('ابر کاربری'), default=True)
    avatar = models.ImageField(_('عکس پروفایل'), upload_to=avatar_path, null=True, blank=True)
    created_by = CurrentUserField(verbose_name='ایجاد شده توسط')
    is_csf_manager = models.BooleanField(default=False, verbose_name='مدیراجرایی خوشه')
    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    class Meta(object):
        managed = True

    def __str__(self):
        return self.fullname

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        user_name = '%s' % (self.username,)
        return user_name.strip()

    def get_short_name(self):
        """
        Returns the short name for the user.
        """
        return self.username


class Camera(models.Model):
    region_name = models.CharField(null=True,max_length=50)
    city_name = models.CharField(null=True,max_length=50)
    latitude = models.CharField(null=True,max_length=20)
    longitude = models.CharField(null=True,max_length=20)

class Proccess(models.Model):
    D20 = models.CharField(null=True,max_length=20)
    D40 = models.CharField(null=True,max_length=20)
    D50 = models.CharField(null=True,max_length=20)
    D80 = models.CharField(null=True,max_length=20)
    start_date = models.DateTimeField(null=True)

    # class Meta:
    #     table_name = "Proccess"