import Link from "next/link";
import { PenSquare, BookOpen, Tag, CheckSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center">
                <PenSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-lg text-gray-800">SnapPad</span>
            </div>

            {/* Simple Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
                  Log in
                </button>
              </Link>
              <Link href="/register">
                <button className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                  Sign up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            SnapPad: Your thoughts, organized by default.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple way to capture, organize, and refine your ideas without the
            friction of traditional editors.
          </p>
        </div>

        {/* Simple Note Preview */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Simple Editor Mockup */}
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
              </div>
              <span className="text-xs text-gray-400">untitled note</span>
            </div>

            <div className="p-5">
              <input
                type="text"
                placeholder="Note title"
                className="w-full text-lg font-medium text-gray-700 bg-transparent border-0 border-b border-gray-100 pb-2 mb-3 focus:outline-none focus:border-blue-200 placeholder-gray-300"
                defaultValue="Meeting notes"
                readOnly
              />

              <div className="space-y-2 text-gray-600">
                <p className="text-sm">• Discuss project timeline</p>
                <p className="text-sm">• Review design mockups</p>
                <p className="text-sm">• Next steps: update documentation</p>
              </div>

              {/* Simple Toolbar */}
              <div className="flex items-center gap-2 pt-4 mt-2 border-t border-gray-100">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <span className="text-sm font-bold">B</span>
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <span className="text-sm italic">I</span>
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Tag className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
          <div className="text-center p-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <PenSquare className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Quick capture</h3>
            <p className="text-sm text-gray-500">
              Write notes without distractions
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Simple organize</h3>
            <p className="text-sm text-gray-500">
              Keep your notes in one place
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckSquare className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Easy to use</h3>
            <p className="text-sm text-gray-500">
              No learning curve, just write
            </p>
          </div>
        </div>

        {/* Simple CTA */}
        <div className="text-center">
          <Link href="/register">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg text-base font-medium hover:bg-blue-600 inline-flex items-center gap-2">
              <PenSquare className="w-4 h-4" />
              Start taking notes — it's free
            </button>
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            No credit card required • Just you and your notes
          </p>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-100 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <div>© 2024 SnapPad. Building in public.</div>
            <div className="flex gap-4">
              <Link href="/about" className="hover:text-gray-600">
                About
              </Link>
              <Link href="/privacy" className="hover:text-gray-600">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-gray-600">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
