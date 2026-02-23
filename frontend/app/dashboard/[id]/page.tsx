"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "@/lib/notes";
import api from "@/lib/axios";
import dynamic from "next/dynamic";

// Load Editor only on client-side to prevent Hydration/SSR errors
const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => <div className="p-10 text-gray-400">Loading editor...</div>,
});

export default function NotePage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const noteId = Number(id);

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

  const handleContentChange = (html: string) => {
    // Save logic
    const timer = setTimeout(() => {
      mutation.mutate({ content: html });
    }, 1000);
    return () => clearTimeout(timer);
  };

  if (isLoading)
    return (
      <div className="p-10 animate-pulse text-gray-400 text-xl">
        Opening note...
      </div>
    );
  if (!note) return <div className="p-10 text-red-500">Note not found.</div>;

  return (
    <div className="flex flex-col h-full w-full">
      <input
        className="text-4xl font-bold p-8 pb-4 outline-none border-none w-full placeholder:text-gray-200"
        defaultValue={note?.title}
        onBlur={(e) => mutation.mutate({ title: e.target.value })}
        placeholder="Note Title..."
      />
      <div className="flex-1 px-8 pb-8">
        {/* Key ensures editor resets when changing notes */}
        <Editor
          key={noteId}
          content={note?.content || ""}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
}
