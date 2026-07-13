"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";

/**
 * Botón de la barra de herramientas del editor. Usa `onMouseDown` (no
 * `onClick`) y `preventDefault` para que el editor no pierda el foco/la
 * selección antes de aplicar el formato.
 */
function ToolbarButton({ isActive, onPress, disabled, label, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={isActive}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      className={`btn btn-xs ${isActive ? "btn-active" : "btn-ghost"}`}
    >
      {children}
    </button>
  );
}

/**
 * Editor de texto rico (Tiptap) para el texto que acompaña cada foto de la
 * galería. Sin límite de caracteres: el HTML se sanitiza en el servidor
 * (ver app/actions.js) antes de guardarlo. `value`/`onChange` manejan HTML,
 * igual que un input controlado.
 */
export default function RichTextEditor({
  value,
  onChange,
  disabled,
  placeholder,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [3] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
        },
      }),
      Placeholder.configure({ placeholder: placeholder || "" }),
    ],
    content: value || "",
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "gallery-rich-text min-h-24 w-full rounded-b-lg px-4 py-3 text-sm focus:outline-none",
      },
    },
  });

  // Sincroniza cuando el padre limpia el valor desde afuera (p. ej. al
  // resetear el formulario tras publicar). No hacemos un sync bidireccional
  // completo para no pelear con la posición del cursor mientras se escribe.
  useEffect(() => {
    if (editor && value === "" && !editor.isEmpty) {
      editor.commands.clearContent();
    }
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) return null;

  return (
    <div className="textarea textarea-bordered flex w-full flex-col gap-0 p-0">
      <div className="flex flex-wrap items-center gap-1 border-b border-base-content/15 bg-base-content/5 p-1.5">
        <ToolbarButton
          label="Negrita"
          isActive={editor.isActive("bold")}
          disabled={disabled}
          onPress={() => editor.chain().focus().toggleBold().run()}
        >
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton
          label="Cursiva"
          isActive={editor.isActive("italic")}
          disabled={disabled}
          onPress={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          label="Subrayado"
          isActive={editor.isActive("underline")}
          disabled={disabled}
          onPress={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="underline">S</span>
        </ToolbarButton>
        <ToolbarButton
          label="Tachado"
          isActive={editor.isActive("strike")}
          disabled={disabled}
          onPress={() => editor.chain().focus().toggleStrike().run()}
        >
          <span className="line-through">T</span>
        </ToolbarButton>

        <span className="mx-1 h-4 w-px bg-base-content/15" />

        <ToolbarButton
          label="Cita"
          isActive={editor.isActive("blockquote")}
          disabled={disabled}
          onPress={() => editor.chain().focus().toggleBlockquote().run()}
        >
          “”
        </ToolbarButton>
        <ToolbarButton
          label="Lista con viñetas"
          isActive={editor.isActive("bulletList")}
          disabled={disabled}
          onPress={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </ToolbarButton>
        <ToolbarButton
          label="Lista numerada"
          isActive={editor.isActive("orderedList")}
          disabled={disabled}
          onPress={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>

        <span className="mx-1 h-4 w-px bg-base-content/15" />

        <ToolbarButton
          label="Enlace"
          isActive={editor.isActive("link")}
          disabled={disabled}
          onPress={() => {
            const previousUrl = editor.getAttributes("link").href;
            const url = window.prompt("Pega el enlace:", previousUrl || "");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
        >
          🔗
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
