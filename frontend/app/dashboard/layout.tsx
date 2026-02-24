"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "@/lib/notes";
import { Note } from "@/types";
import { LogOut, Plus, StickyNote, Trash2, Search, Menu, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { authService } from "@/lib/auth";


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

  // Close sidebar when route changes on mobile
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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile First Approach */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 bg-white border-r border-gray-200 flex flex-col
          h-full shadow-xl lg:shadow-none
        `}
      >
        <div className="p-4 lg:p-6 flex items-center gap-2 font-bold text-xl text-blue-600">
          <StickyNote size={24} className="lg:w-7 lg:h-7" />
          <span className="text-lg lg:text-xl">SnapPad</span>
        </div>

        <div className="px-3 lg:px-4 mb-3 lg:mb-4">
          <button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 text-sm lg:text-base"
          >
            <Plus size={16} className="lg:w-[18px] lg:h-[18px]" />
            {createMutation.isPending ? "Creating..." : "New Note"}
          </button>
        </div>

        <div className="px-3 lg:px-4 mb-3 lg:mb-4 relative">
          <div className="absolute inset-y-0 left-4 lg:left-6 flex items-center pointer-events-none text-gray-400">
            <Search size={14} className="lg:w-4 lg:h-4" />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 lg:pl-10 pr-3 lg:pr-4 py-1.5 lg:py-2 bg-gray-100 border-none rounded-lg text-xs lg:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <nav className="flex-1 px-3 lg:px-4 space-y-0.5 lg:space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase px-2 mb-1 lg:mb-2">
            My Notes
          </p>
          {isLoading && (
            <p className="px-2 text-xs lg:text-sm text-gray-400 italic">Loading...</p>
          )}
          {notes?.map((note: Note) => (
            <div
              key={note.id}
              onClick={() => {
                router.push(`/dashboard/${note.id}`);
                setIsSidebarOpen(false);
              }}
              className="p-2 lg:p-3 text-xs lg:text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md cursor-pointer transition-all flex justify-between items-center group"
            >
              <span className="truncate flex-1">
                {note.title || "Untitled Note"}
              </span>

              <div className="flex items-center gap-0.5 lg:gap-1 shrink-0">
                {note.is_pinned && (
                  <span className="text-blue-500 text-xs">📌</span>
                )}

                <button
                  onClick={(e) => handleDelete(e, note.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded transition-all"
                  title="Delete note"
                >
                  <Trash2 size={12} className="lg:w-[14px] lg:h-[14px]" />
                </button>
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 lg:p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-gray-600 hover:text-red-600 p-2 rounded-md transition-colors text-sm lg:text-base"
          >
            <LogOut size={16} className="lg:w-[18px] lg:h-[18px]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white lg:ml-0">
        {children}
      </main>
    </div>
  );
}