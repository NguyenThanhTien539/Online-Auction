/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor } from "@tinymce/tinymce-react";

type TinyMCEEditorProps = {
  editorRef: any;
  value: string;
  isReadOnly?: boolean; 
};

export default function TinyMCEEditor({
  editorRef,
  value,
  isReadOnly = false,
}: TinyMCEEditorProps) {
  return (
    <Editor
      apiKey={`${import.meta.env.VITE_TINY_MCE}`}
      onInit={(_evt, editor) => {
        editorRef.current = editor;

        if (isReadOnly && (editor as any).mode?.set) {
          (editor as any).mode.set("readonly");
        }
      }}
      initialValue={value}
      init={{
        height: 400,
        menubar: true, // muốn thì để true, không ảnh hưởng readonly
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | bold italic forecolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | help",
        statusbar: true,
      }}
    />
  );
}
