from rest_framework import generics, permissions, filters
from .models import Note
from .serializers import NoteSerializer

class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', "updated_at", 'title']
    ordering = ["-is_pinned", "-updated_at"]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    lookup_field = 'id'

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)