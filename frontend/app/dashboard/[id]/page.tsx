"use client";

import React, { useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "@/lib/notes";
import api from "@/lib/axios";
import dynamic from "next/dynamic";

const SimpleEditor = dynamic(
  () => import("@/components/tiptap-templates/simple/simple-editor").then((mod) => mod.SimpleEditor),
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
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleContentChange = useCallback((html: string) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      mutation.mutate({ content: html });
    }, 1000);
  }, [mutation]);

  const handleTitleChange = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    mutation.mutate({ title: e.target.value });
  }, [mutation]);

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
      {/* Title Input */}
      <input
        type="text"
        className="text-2xl sm:text-3xl md:text-4xl font-bold p-4 sm:p-6 md:p-8 pb-2 sm:pb-3 md:pb-4 outline-none border-none w-full placeholder:text-gray-200 text-gray-800 bg-transparent"
        defaultValue={note?.title}
        onBlur={handleTitleChange}
        placeholder="Note Title..."
      />

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