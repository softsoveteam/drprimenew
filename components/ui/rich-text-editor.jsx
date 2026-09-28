import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export const RichTextEditor = ({ value, onChange, placeholder, height = 500 }) => {
  const editorRef = useRef(null);

  return (
    <div className="w-full tinymce-wrap [&_.tox-tinymce]:rounded-lg [&_.tox-tinymce]:border-slate-200">
      <Editor
        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.3.0/tinymce.min.js"
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value ?? ''}
        onEditorChange={(newValue) => {
          if (onChange) {
            onChange(newValue);
          }
        }}
        init={{
          height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'table', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | link | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          placeholder: placeholder || 'Start typing...',
          branding: false,
          promotion: false,
          license_key: 'gpl',
        }}
      />
    </div>
  );
};

export default RichTextEditor;
