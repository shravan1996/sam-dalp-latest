# Copyright (C) 2021-2022 Intel Corporation
#
# SPDX-License-Identifier: MIT



from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField

User = get_user_model()

class UserDetail(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Others'),
    )
    PRIMARY_LANGUAGE_CHOICES = (
        ('Telugu', 'Telugu'),
        ('Hindi', 'Hindi'),
        ('Tamil', 'Tamil'),
        ('Kannada', 'Kannada'),
        ('Marathi', 'Marathi'),
        ('Other', 'Others'),
    )
    ENGLISH_PROFICIENCY_CHOICES = (
        ('basic', 'Basic'),
        ('good', 'Good Command'),
        ('v_good', 'Very Good Command'),
        ('ex', 'Excellent Command'),
        ('fluent', 'Fluent'),
        ('native', 'Native Speaker')
    )
    EDUCATION_CHOICES = (
        ('10th', '10th Standard'),
        ('12th', '12th Standard'),
        ("bachelor", "Bachelor's Degree"),
        ("master", "Master's Degree"),
    )
    PRIOR_EXPERIENCE_CHOICES = [
        ('image', 'Image Annotation'),
        ('audio', 'Audio Annotation'),
        ('video', 'Video Annotation'),
        ('text', 'Text Annotation'),
        ('none', 'None'),
    ]
    CATEGORY_CHOICES = (
        ('ANNOTATOR', 'ANNOTATOR'),
        ('PROJECT MANAGER', 'PROJECT MANAGER'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    dob = models.DateField(null=True)
    mobile_number = models.CharField(max_length=20, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True)
    address = models.CharField(max_length=255, null=True)
    city = models.CharField(max_length=255, null=True)
    state = models.CharField(max_length=255, null=True)
    district = models.CharField(max_length=255, null=True)
    zipcode = models.CharField(max_length=6, null=True)
    primary_language = models.CharField(max_length=20, choices=PRIMARY_LANGUAGE_CHOICES, null=True)
    english_proficiency = models.CharField(max_length=20, choices=ENGLISH_PROFICIENCY_CHOICES, null=True)
    education = models.CharField(max_length=20, choices=EDUCATION_CHOICES, null=True)
    prior_experience = ArrayField(models.CharField(max_length=255), blank=True, null=True)

    def username(self):
        return self.user.username

    def email(self):
        return self.user.email

    def first_name(self):
        return self.user.first_name

    def last_name(self):
        return self.user.last_name

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