import React, { useState } from "react";
import axios from "axios";
import { FaFile, FaTrash } from "react-icons/fa";

const AttachmentUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileSelect = (event) => {
    const newFiles = [...event.target.files];
    setFiles([...files, ...newFiles]);
    newFiles.forEach(async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.put(
          "http://192.168.29.240:9000/upload/v1/upload/file",
          formData
        );
        setUploadedFiles((prevUploadedFiles) => [
          ...prevUploadedFiles,
          response.data.url,
        ]);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleDelete = (file) => {
    setFiles(files.filter((f) => f !== file));
    setUploadedFiles((prevUploadedFiles) =>
      prevUploadedFiles.filter((f) => f !== file.awsLink)
    );
  };

  return (
    <div className="attachment-uploader">
      <label htmlFor="file-input">
        <div className="select-file">
          <span className="text">Select file</span>
        </div>
      </label>
      <input
        id="file-input"
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <div className="file-list">
        {files.map((file) => (
          <div className="file" key={file.name}>
            <FaFile />
            <p className="name">{file.name}</p>
            <button
              className="delete-button"
              onClick={() => handleDelete(file)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      {/* {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <p>Uploaded files:</p>
          <ul>
            {uploadedFiles.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default AttachmentUploader;
