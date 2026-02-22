from django.urls import path
from .views import NoteListCreateView, NoteDetailView

urlpatterns = [
    path("", NoteListCreateView.as_view(), name="note_list_create"),
    path("<int:id>/", NoteDetailView.as_view(), name="note_detail"),
]