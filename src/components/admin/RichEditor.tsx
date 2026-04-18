import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Code, Link as LinkIcon } from "lucide-react";

type Props = {
  content: string;
  onChange: (html: string, wordCount: number) => void;
};

export function RichEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Commencez à écrire votre article…" }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const wordCount = editor.getText().trim().split(/\s+/).filter(Boolean).length;
      onChange(html, wordCount);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[400px] px-4 py-3 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const Btn = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`grid h-8 w-8 place-items-center rounded transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-xl border border-border bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 px-2 py-1.5">
        <Btn title="Gras" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Btn>
        <Btn title="Italique" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Btn>
        <span className="mx-1 h-5 w-px bg-border" />
        <Btn title="Titre 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Btn>
        <Btn title="Titre 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></Btn>
        <span className="mx-1 h-5 w-px bg-border" />
        <Btn title="Liste" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Btn>
        <Btn title="Liste numérotée" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Btn>
        <span className="mx-1 h-5 w-px bg-border" />
        <Btn title="Citation" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Btn>
        <Btn title="Code" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code className="h-4 w-4" /></Btn>
        <Btn title="Lien" active={editor.isActive("link")} onClick={() => {
          const url = prompt("URL du lien :");
          if (url) editor.chain().focus().setLink({ href: url }).run();
          else editor.chain().focus().unsetLink().run();
        }}><LinkIcon className="h-4 w-4" /></Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
