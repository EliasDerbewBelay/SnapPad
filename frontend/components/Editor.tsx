"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Bold, Italic, List, ListOrdered, Underline as UnderlineIcon } from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, Color],
    content: content,
    immediatelyRender: false, // Fixed syntax error (= to :)
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return <div className="p-8 text-gray-400 italic">Initializing editor...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 border-b border-gray-100 bg-gray-50/50">
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
        >
          <Bold size={18} />
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
        >
          <Italic size={18} />
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded ${editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
        >
          <UnderlineIcon size={18} />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
        >
          <List size={18} />
        </button>
        <button 
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
        >
          <ListOrdered size={18} />
        </button>
      </div>

      {/* Editable Area */}
      <EditorContent 
        editor={editor} 
        className="flex-1 overflow-y-auto p-8 prose max-w-none focus:outline-none min-h-[300px]"
      />
    </div>
  );
}