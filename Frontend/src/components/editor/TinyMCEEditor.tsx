/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor } from "@tinymce/tinymce-react";

export default function TinyMCEEditor(props: {
  editorRef: any,
  value?: string;
  onEditChange?: any;
}) {
  const { editorRef, value } = props;
  return (
    <>
      <Editor
        apiKey={`${import.meta.env.VITE_TINY_MCE}`}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue={value}
        onEditorChange={(newValue) => {
          if (props.onEditChange) {
            props.onEditChange(newValue);
          }
        }}
        init={{
          height: 400,
          menubar: true,
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
          toolbar: `undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help`,
          // Ensure low z-index to not interfere with other components
          skin: 'oxide',
          content_css: 'default',
          promotion: false,
          // Custom z-index values
          popup_css_add: '.tox-pop { z-index: 50 !important; }',
        }}
      />
    </>
  );
}
