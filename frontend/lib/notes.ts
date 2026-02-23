import api from './axios';
import { Note } from '@/types';

export const noteService = {
  // Get all notes for the sidebar
  getAll: async (search?: string): Promise<Note[]> => {
    const response = await api.get('/notes/', {
      params: { search }
    });
    return response.data;
  },

  // Create a new empty note
  create: async (): Promise<Note> => {
    const response = await api.post('/notes/', {
      title: "New Note",
      content: "",
    });
    return response.data;
  },

  // Update a note (Auto-save)
  update: async (id: number, data: Partial<Note>): Promise<Note> => {
    const response = await api.put(`/notes/${id}/`, data);
    return response.data;
  },

  // Delete a note
  delete: async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}/`);
  }
};