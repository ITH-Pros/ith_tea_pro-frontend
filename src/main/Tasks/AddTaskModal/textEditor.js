import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

  const TextEditor = ({ height, width, placeholder, value, onChange}) => {
    const [editorContent, setEditorContent] = useState(value || "");
    
    useEffect(()=>{
      setEditorContent(value)
    },[value])
  
    const handleChange = (content) => {
      setEditorContent(content);
      onChange && onChange(content);
    };
    const handleReset = (e) => {
      e.preventDefault();
      setEditorContent("");
    };

    return (
      <>
      <ReactQuill
        style={{ height, width: "100%" }}
        placeholder={placeholder}
        value={editorContent}
        onChange={handleChange}
      />
        <button id='handleresetbuttonid' hidden={true} onClick={handleReset}>Reset</button>
      </>
        

    );
  };

export default TextEditor;
