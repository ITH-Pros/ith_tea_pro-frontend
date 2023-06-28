/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useRef } from 'react';
import { uploadProfileImage } from "../../../services/user/api";
import Loader from "../../../components/Loader";

const AttachmentUploader = (props) => {
  const { taskAttachments, uploadedAttachmentsArray , isResetAttachment  } = props;
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState(taskAttachments || []);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    uploadedAttachmentsArray(uploadedFiles);
  }, [uploadedFiles]);

  useEffect(() => {

      resetAttachment();
    
  }, [isResetAttachment]);



  const handleFileSelect = (event) => {
    setLoading(true)
    const newFiles = [...event.target.files];
    let newUrls = [];
    newFiles.forEach(async (file, index) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadProfileImage(formData);
        if (response.error) {
          setLoading(false)
          // console.log("Error while Updating details");
          return;
        } else {
          setLoading(false)
          newUrls.push(response?.url);
        }
        if (index === newFiles.length - 1) {
          setUploadedFiles([...files, ...newUrls]);
          setFiles([...files, ...newUrls]);
          uploadedAttachmentsArray([...taskAttachments, ...newUrls]);
          setLoading(false)
        }
      } catch (error) {
        console.error(error);
        setLoading(false)
      }
    });
  };

  const resetAttachment = () => {
    fileInputRef.current.value = ''; 
    setFiles([]);
    setUploadedFiles([]);
    uploadedAttachmentsArray([]);
  };

  useEffect(() => {
    console.log("files", files);
  }
  , [files]);

  return (

    <>
     <div className="attachment-uploader col-md-4">
      <label htmlFor="file-input">
        <div className="select-file">
          <span className="text">Select file</span>
        </div>
      </label>
      <input id="file-input" type="file"  onChange={handleFileSelect} className="px-1 py-1" ref={fileInputRef}  style={{height:'auto'}}/>
      <div className="file-list">
        {files.length>0 && files.map((file, index) => {
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
    {loading ? <Loader /> : null}

    </>
  );
};

export default AttachmentUploader;
