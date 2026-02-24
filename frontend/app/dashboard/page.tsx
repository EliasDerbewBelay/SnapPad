"use client";
import { StickyNote, PenSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-md text-center">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl flex items-center justify-center">
            <StickyNote size={64} className="text-blue-500 dark:text-blue-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center border border-gray-100 dark:border-gray-700">
            <PenSquare size={24} className="text-indigo-500 dark:text-indigo-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
          Select a note to view
        </h2>
        
        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Choose a note from the sidebar to start editing, or create a new one to capture your thoughts.
        </p>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Link href="/dashboard/new">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <PenSquare size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-700 dark:text-gray-300">Create new note</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Start writing your thoughts</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </button>
          </Link>

          {/* Tips */}
          <div className="pt-6">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Quick tips:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg text-gray-500 dark:text-gray-400">
                📌 Pin important notes
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg text-gray-500 dark:text-gray-400">
                🔍 Search to find notes
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg text-gray-500 dark:text-gray-400">
                ⌨️ Use markdown shortcuts
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg text-gray-500 dark:text-gray-400">
                💾 Auto-saves your work
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}