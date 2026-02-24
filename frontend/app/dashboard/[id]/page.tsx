"use client";

import React, { useCallback, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "@/lib/notes";
import api from "@/lib/axios";
import dynamic from "next/dynamic";
import { Pin, PinOff, Save, Clock, MoreVertical } from "lucide-react";

const SimpleEditor = dynamic(
  () => import("@/components/tiptap-templates/simple/simple-editor").then(
    (mod) => mod.SimpleEditor
  ),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading editor...</p>
        </div>
      </div>
    ),
  }
);

export default function NotePage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const noteId = Number(id);
  const saveTimerRef = useRef<NodeJS.Timeout>();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => api.get(`/notes/${noteId}/`).then((res) => res.data),
    enabled: !!noteId,
  });

  const mutation = useMutation({
    mutationFn: (updates: any) => noteService.update(noteId, updates),
    onSuccess: () => {
      setLastSaved(new Date());
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
    [mutation]
  );

  const handleTitleChange = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      mutation.mutate({ title: e.target.value });
    },
    [mutation]
  );

  const togglePin = useCallback(() => {
    mutation.mutate({ is_pinned: !note?.is_pinned });
  }, [mutation, note?.is_pinned]);

  const formatLastSaved = () => {
    if (!lastSaved) return null;
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    return lastSaved.toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Opening your note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PinOff size={32} className="text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Note not found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            The note you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Title Input */}
          <input
            type="text"
            className="text-2xl font-bold outline-none border-none w-full bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600"
            defaultValue={note?.title}
            onBlur={handleTitleChange}
            placeholder="Untitled Note"
          />

          <div className="flex items-center gap-2">
            {/* Save Status */}
            {lastSaved && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mr-2">
                <Save size={14} />
                <span>Saved {formatLastSaved()}</span>
              </div>
            )}

            {/* Pin Button */}
            <button
              onClick={togglePin}
              className={`
                p-2.5 rounded-xl transition-all
                ${note.is_pinned
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-300 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-400 dark:hover:text-gray-400'
                }
              `}
              title={note.is_pinned ? "Unpin note" : "Pin note"}
            >
              {note.is_pinned ? <Pin size={20} fill="currentColor" /> : <PinOff size={20} />}
            </button>

            {/* More Options (could be expanded later) */}
            <button className="p-2.5 rounded-xl text-gray-300 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-400 dark:hover:text-gray-400 transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <SimpleEditor
          key={noteId}
          initialContent={note?.content || ""}
          onContentChange={handleContentChange}
        />
      </div>
    </div>
  );
}