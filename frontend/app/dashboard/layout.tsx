"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "@/lib/notes";
import { Note } from "@/types";
import {
  LogOut,
  Plus,
  StickyNote,
  Trash2,
  Search,
  Menu,
  X,
  Pin,
  FolderOpen,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { authService } from "@/lib/auth";
import ModeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [params.id]);

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes", searchQuery],
    queryFn: () => noteService.getAll(searchQuery),
  });

  const createMutation = useMutation({
    mutationFn: () => noteService.create(),
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push(`/dashboard/${newNote.id}`);
      setIsSidebarOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => noteService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (Number(params.id) === deletedId) {
        router.push("/dashboard");
      }
    },
  });

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  const pinnedNotes = notes?.filter((note: Note) => note.is_pinned) || [];
  const unpinnedNotes = notes?.filter((note: Note) => !note.is_pinned) || [];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Mobile Menu Button - Clean, floating style */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - New clean design: minimal borders, softer colors, modern typography */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64 bg-white dark:bg-gray-800 flex flex-col
          h-full shadow-md lg:shadow-none
        `}
      >
        {/* Header - Simplified with centered logo and toggle */}
        <div className="p-4 flex justify-between items-center border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <StickyNote size={18} className="text-white" />
            </div>
            <span className="font-semibold text-lg text-gray-800 dark:text-white">
              SnapPad
            </span>
          </div>
          <ModeToggle />
        </div>

        {/* New Note Button - Clean, full-width, subtle gradient */}
        <div className="p-4">
          <button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 font-medium text-sm"
          >
            <Plus size={16} />
            {createMutation.isPending ? "Creating..." : "New Note"}
          </button>
        </div>

        {/* Search Bar - Minimal, rounded, with icon */}
        <div className="px-4 mb-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all text-gray-700 dark:text-gray-300 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Notes Navigation - Clean sections with subtle dividers */}
        <nav className="flex-1 px-4 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pinned Notes Section - Minimal header */}
              {pinnedNotes.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 mb-2 text-xs text-gray-500 uppercase font-medium">
                    <Pin size={12} />
                    Pinned ({pinnedNotes.length})
                  </div>
                  <div className="space-y-1">
                    {pinnedNotes.map((note: Note) => (
                      <NoteItem
                        key={note.id}
                        note={note}
                        isActive={Number(params.id) === note.id}
                        onSelect={() => {
                          router.push(`/dashboard/${note.id}`);
                          setIsSidebarOpen(false);
                        }}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Notes Section */}
              <div>
                <div className="flex items-center gap-1 mb-2 text-xs text-gray-500 uppercase font-medium">
                  <FolderOpen size={12} />
                  All Notes ({unpinnedNotes.length})
                </div>
                <div className="space-y-1">
                  {unpinnedNotes.map((note: Note) => (
                    <NoteItem
                      key={note.id}
                      note={note}
                      isActive={Number(params.id) === note.id}
                      onSelect={() => {
                        router.push(`/dashboard/${note.id}`);
                        setIsSidebarOpen(false);
                      }}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>

              {/* Empty State - Clean, centered */}
              {notes?.length === 0 && (
                <div className="text-center py-6">
                  <StickyNote
                    size={32}
                    className="text-gray-300 dark:text-gray-600 mx-auto mb-2"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    No notes yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Create your first note
                  </p>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Bottom Actions - Simple logout */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content - Unchanged */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="flex-1 flex flex-col lg:ml-4 lg:mt-4 lg:mr-4 lg:mb-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

// Note Item Component - New clean design: rounded, subtle hover, inline pin
function NoteItem({
  note,
  isActive,
  onSelect,
  onDelete,
}: {
  note: Note;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent, id: number) => void;
}) {
  const previewText =
    note.content
      ?.replace(/<[^>]*>/g, "")
      .split("\n")[0]
      .slice(0, 40) || "Empty note";

  const preview = previewText.length < 40 ? previewText : previewText + "...";

  return (
    <div
      onClick={onSelect}
      className={`
        group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all
        ${isActive ? "bg-blue-100 dark:bg-blue-800/20" : "hover:bg-gray-100 dark:hover:bg-gray-700"}
      `}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <h3
            className={`font-medium truncate text-sm ${isActive ? "text-blue-600 dark:text-blue-300" : "text-gray-800 dark:text-gray-200"}`}
          >
            {note.title || "Untitled Note"}
          </h3>
          {note.is_pinned && (
            <Pin size={10} className="text-blue-500" fill="currentColor" />
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">{preview}</p>
      </div>
      <button
        onClick={(e) => onDelete(e, note.id)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
        title="Delete note"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
