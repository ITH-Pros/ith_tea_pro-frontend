import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ height, width, placeholder, value, onChange }) => {
    console.log("assssssssssssss", value)
    // const [editorContent, setEditorContent] = useState(value || "");

    // const handleChange = (content ) => {
    //     console.log(editorContent, '===========================>>>>>>>>>>>>>>>>CONTENT', value)
    //     setEditorContent(content);
    //     onChange && onChange(content);
    // };




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
