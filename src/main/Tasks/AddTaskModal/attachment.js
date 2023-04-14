/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { uploadProfileImage } from "../../../services/user/api";

const AttachmentUploader = (props) => {
  const { taskAttachments, uploadedAttachmentsArray } = props;
  const [files, setFiles] = useState(taskAttachments || []);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    uploadedAttachmentsArray(uploadedFiles);
  }, [uploadedFiles]);

  const handleFileSelect = (event) => {
    const newFiles = [...event.target.files];
    let newUrls = [];
    newFiles.forEach(async (file, index) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadProfileImage(formData);
        if (response.error) {
          console.log("Error while Updating details");
          return;
        } else {
          newUrls.push(response?.url);
        }
        if (index === newFiles.length - 1) {
          setUploadedFiles([...files, ...newUrls]);
          setFiles([...files, ...newUrls]);
          uploadedAttachmentsArray([...taskAttachments, ...newUrls]);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="attachment-uploader col-md-4">
      <label htmlFor="file-input">
        <div className="select-file">
          <span className="text">Select file</span>
        </div>
      </label>
      <input id="file-input" type="file" multiple onChange={handleFileSelect} className="px-1 py-1"  style={{height:'auto'}}/>
      <div className="file-list">
        {files.map((file, index) => {
          return (
            <div className="file" key={index}>
              <a target="_blank" className="fa fa-square" href={file}></a>{" "}
              <span className="name">
                {file?.name || "Attachment " + (index + 1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttachmentUploader;
