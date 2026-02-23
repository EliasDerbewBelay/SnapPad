"use client";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "@/lib/notes";
import { Note } from "@/types";
import { LogOut, Plus, StickyNote } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: () => noteService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: () => noteService.create(),
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // FIXED: Matches folder structure src/app/dashboard/[id]
      router.push(`/dashboard/${newNote.id}`);
    },
  });

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-2 font-bold text-xl text-blue-600">
          <StickyNote size={28} />
          <span>SnapPad</span>
        </div>

        <div className="px-4 mb-4">
          <button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Plus size={18} />
            {createMutation.isPending ? "Creating..." : "New Note"}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase px-2 mb-2">
            My Notes
          </p>
          {isLoading && (
            <p className="px-2 text-sm text-gray-400 italic">Loading...</p>
          )}
          {notes?.map((note: Note) => (
            <div
              key={note.id}
              onClick={() => router.push(`/dashboard/${note.id}`)}
              className="p-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md cursor-pointer transition-all flex justify-between items-center"
            >
              <span className="truncate">{note.title || "Untitled Note"}</span>
              {note.is_pinned && (
                <span className="text-blue-500 text-xs">📌</span>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-gray-600 hover:text-red-600 p-2 rounded-md transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-white">{children}</main>
    </div>
  );
}
