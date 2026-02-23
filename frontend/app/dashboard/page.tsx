"use client";
import { StickyNote } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
      <div className="bg-gray-50 p-6 rounded-full mb-4">
        <StickyNote size={48} />
      </div>
      <h2 className="text-xl font-medium text-gray-600">
        Select a note to view
      </h2>
      <p className="text-sm">
        Or create a new one to start snapping your thoughts.
      </p>
    </div>
  );
}
