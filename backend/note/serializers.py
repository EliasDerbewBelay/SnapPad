from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Note
        fields = [
            'id', 
            'slug', 
            'user', 
            'title', 
            'content', 
            'font_color', 
            'background_color',  # <--- Add this line
            'is_pinned', 
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

    # Optional: Add validation for the background color hex as well
    def validate_background_color(self, value):
        if not value.startswith('#') or len(value) != 7:
            raise serializers.ValidationError("Background color must be a valid hex code.")
        return value

    def validate_font_color(self, value):
        if not value.startswith('#') or len(value) != 7:
            raise serializers.ValidationError("Font color must be a valid hex code.")
        return value