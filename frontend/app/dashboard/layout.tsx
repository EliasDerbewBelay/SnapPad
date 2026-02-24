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
  Settings,
  HelpCircle,
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

  // Separate pinned and unpinned notes
  const pinnedNotes = notes?.filter((note: Note) => note.is_pinned) || [];
  const unpinnedNotes = notes?.filter((note: Note) => !note.is_pinned) || [];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 dark:bg-black/70 z-30 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col
          h-full shadow-xl lg:shadow-none
        `}
      >
        {/* Header with Logo and Theme Toggle */}
        <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <StickyNote size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-800 dark:text-gray-200">
              SnapPad
            </span>
          </div>
          <ModeToggle />
        </div>

        {/* New Note Button */}
        <div className="p-4">
          <button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 font-medium"
          >
            <Plus size={18} />
            {createMutation.isPending ? "Creating..." : "New Note"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 mb-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 outline-none transition-all text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Notes Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pinned Notes Section */}
              {pinnedNotes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-2 mb-2">
                    <Pin
                      size={14}
                      className="text-gray-400 dark:text-gray-500"
                    />
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Pinned ({pinnedNotes.length})
                    </p>
                  </div>
                  <div className="space-y-0.5">
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
                <div className="flex items-center gap-2 px-2 mb-2">
                  <FolderOpen
                    size={14}
                    className="text-gray-400 dark:text-gray-500"
                  />
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    All Notes ({unpinnedNotes.length})
                  </p>
                </div>
                <div className="space-y-0.5">
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

              {/* Empty State */}
              {notes?.length === 0 && (
                <div className="text-center py-8 px-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <StickyNote
                      size={24}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    No notes yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Create your first note to get started
                  </p>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-700 space-y-1">
          <button className="w-full flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors text-sm">
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors text-sm">
            <HelpCircle size={16} />
            <span>Help & Support</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 overflow-hidden">
        {children}
      </main>
    </div>
  );
}

// Note Item Component
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
  // Get preview text (first line or first 50 chars)
  const previewText =
    note.content
      ?.replace(/<[^>]*>/g, "") // Remove HTML tags
      .split("\n")[0] // First line
      .slice(0, 50) || "Empty note";

  const preview = previewText.length < 50 ? previewText : previewText + "...";

  return (
    <div
      onClick={onSelect}
      className={`
        group p-3 rounded-xl cursor-pointer transition-all
        ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500"
            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-medium truncate text-sm ${
                isActive
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {note.title || "Untitled Note"}
            </h3>
            {note.is_pinned && (
              <Pin
                size={12}
                className="text-blue-500 dark:text-blue-400 shrink-0"
                fill="currentColor"
              />
            )}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {preview}
          </p>
        </div>

        <button
          onClick={(e) => onDelete(e, note.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all shrink-0"
          title="Delete note"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
