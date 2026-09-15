import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  return (
    <div className="w-full">
      <Editor
        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.3.0/tinymce.min.js"
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={(newValue, editor) => {
          if (onChange) {
            onChange(newValue);
          }
        }}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          placeholder: placeholder || 'Start typing...',
          branding: false,
          promotion: false
        }}
      />
    </div>
  );
};

export default RichTextEditor;
