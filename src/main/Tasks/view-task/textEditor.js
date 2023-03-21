import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ height, width, placeholder, value, onChange }) => {
  const [editorContent, setEditorContent] = useState(value || "");

    const handleChange = (content) => {
      console.log(content,'===========================>>>>>>>>>>>>>>>>CONTENT')
    setEditorContent(content);
    onChange && onChange(content);
  };

  
  

  return (
    <ReactQuill
      style={{ height, width }}
      placeholder={placeholder}
      value={editorContent}
      onChange={handleChange}

    />
  );
};

export default TextEditor;
