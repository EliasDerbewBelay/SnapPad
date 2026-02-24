"use client";

import React, { useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "@/lib/notes";
import api from "@/lib/axios";
import dynamic from "next/dynamic";
import { Pin, PinOff } from "lucide-react"; // Added for pinning UI

const SimpleEditor = dynamic(
  () =>
    import("@/components/tiptap-templates/simple/simple-editor").then(
      (mod) => mod.SimpleEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 sm:p-6 md:p-10 text-gray-400 animate-pulse text-sm sm:text-base">
        Loading Advanced Editor...
      </div>
    ),
  },
);

export default function NotePage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const noteId = Number(id);
  const saveTimerRef = useRef<NodeJS.Timeout>();

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => api.get(`/notes/${noteId}/`).then((res) => res.data),
    enabled: !!noteId,
  });

  const mutation = useMutation({
    mutationFn: (updates: any) => noteService.update(noteId, updates),
    onSuccess: () => {
      // Refresh both the specific note and the sidebar list to reflect pin/title changes
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleContentChange = useCallback(
    (html: string) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(() => {
        mutation.mutate({ content: html });
      }, 1000);
    },
    [mutation],
  );

  const handleTitleChange = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      mutation.mutate({ title: e.target.value });
    },
    [mutation],
  );

  // NEW: Pin Toggle Function
  const togglePin = useCallback(() => {
    mutation.mutate({ is_pinned: !note?.is_pinned });
  }, [mutation, note?.is_pinned]);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-10 animate-pulse text-gray-400 text-base sm:text-lg md:text-xl">
        Opening note...
      </div>
    );
  }

  if (!note) {
    return (
      <div className="p-4 sm:p-6 md:p-10 text-red-500 text-sm sm:text-base">
        Note not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      {/* Header Area: Title + Pin Button */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-4 sm:pt-6">
        <input
          type="text"
          className="text-2xl sm:text-3xl md:text-4xl font-bold outline-none border-none w-full placeholder:text-gray-200 text-gray-800 bg-transparent"
          defaultValue={note?.title}
          onBlur={handleTitleChange}
          placeholder="Note Title..."
        />

        {/* PIN TOGGLE BUTTON */}
        <button
          onClick={togglePin}
          className={`ml-4 p-2.5 sm:p-3 rounded-xl transition-all flex-shrink-0 ${
            note.is_pinned
              ? "bg-blue-50 text-blue-600 shadow-sm"
              : "text-gray-300 hover:bg-gray-50 hover:text-gray-400"
          }`}
          title={note.is_pinned ? "Unpin Note" : "Pin Note"}
        >
          {note.is_pinned ? (
            <Pin
              size={22}
              className="sm:w-[24px] sm:h-[24px]"
              fill="currentColor"
            />
          ) : (
            <PinOff size={22} className="sm:w-[24px] sm:h-[24px]" />
          )}
        </button>
      </div>
      <div className="h-2 sm:h-4" /> {/* Spacer */}
      {/* Advanced Editor Area */}
      <div className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 pb-3 sm:pb-4 md:pb-6 lg:pb-8 overflow-hidden">
        <SimpleEditor
          key={noteId}
          initialContent={note?.content || ""}
          onContentChange={handleContentChange}
        />
      </div>
    </div>
  );
}
