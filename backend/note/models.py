import uuid
from django.db import models
from django.conf import settings 

class Note(models.Model):
    # 1. Ownership: Link to our Custom User
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="notes"
    )

    # 2. Basic Info
    title = models.CharField(max_length=255, default="Untitled Note")

    # 3. Content
    content = models.TextField(blank=True, help_text="Write your note here...")

    # 4. Custom Styling

    font_color = models.CharField(max_length=7, default = "#000000", help_text="Font color in HEX, e.g. #000000 for black")

    background_color = models.CharField(max_length=7, default = "#FFFFFF", help_text="Background color in HEX, e.g. #FFFFFF for white")
    
    # 5. Organization and Utility

    is_pinned = models.BooleanField(default=False)
    slug = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_pinned', '-updated_at']

    def __str__(self):
        return f"{self.title} | {self.user.username}"