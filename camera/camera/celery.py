from __future__ import absolute_import, unicode_literals
import os
from celery import Celery


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'camera.settings')

app = Celery('camera.webApp.BackCods.Python.plotly')

app.config_from_object('django.conf:settings', namespace='celery')

app.autodiscover_tasks()