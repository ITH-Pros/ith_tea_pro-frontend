import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ height, width, placeholder, value, onChange }) => {
  return (
    <ReactQuill
      style={{ height, width }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default TextEditor;
