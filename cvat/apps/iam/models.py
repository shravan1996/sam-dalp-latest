# Copyright (C) 2021-2022 Intel Corporation
#
# SPDX-License-Identifier: MIT

from django.db import models
# from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=255)
    login_time = models.DateTimeField()
    logout_time = models.DateTimeField(null=True, blank=True)
    session_duration = models.DurationField(null=True, blank=True)
    comments = models.CharField(max_length=255, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.logout_time and self.login_time:
            self.session_duration = self.logout_time - self.login_time
        super().save(*args, **kwargs)