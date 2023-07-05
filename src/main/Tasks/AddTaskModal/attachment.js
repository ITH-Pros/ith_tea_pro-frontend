/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useRef } from 'react';
import { uploadProfileImage } from "../../../services/user/api";
import Loader from "../../../components/Loader";
import Toaster from "../../../components/Toaster";

const AttachmentUploader = (props) => {
  const { taskAttachments, uploadedAttachmentsArray, isResetAttachment } = props;
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState(taskAttachments || []);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false)
  const [toaster, setToaster] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");

  useEffect(() => {
    uploadedAttachmentsArray(uploadedFiles); 
  }, [uploadedFiles]);

  useEffect(() => {
    resetAttachment();
  }, [isResetAttachment]);

  const handleFileSelect = async (event) => {
    setLoading(true)
    const newFiles = [...event.target.files];
    let newUrls = [];
    for (const file of newFiles) {
      console.log("File selected: " + file.name);
      if (isFileAlreadyUploaded(file)) {
        console.log("File already uploaded: " + file.name);
        setToasterMessage("File already uploaded: " + file.name);
        setToaster(true);
      } else {
        try {
          const formData = new FormData();
          formData.append("file", file);
          const response = await uploadProfileImage(formData);
          if (response.error) {
            setToasterMessage("Error while uploading file: " + file.name);
            setToaster(true);
          } else {
            newUrls.push(response?.url);
          }
        } catch (error) {
          console.error(error);
          setToasterMessage("Error while uploading file: " + file.name);
          setToaster(true);
          setLoading(false);
          return;
        }
      }
      console.log("File uploaded: " + file.name);
    }
    setUploadedFiles([...uploadedFiles, ...newUrls]);
    setFiles([...files, ...newUrls]);
    uploadedAttachmentsArray([...taskAttachments, ...newUrls]);
    setLoading(false);
  };

  const isFileAlreadyUploaded = (file) => {
    for (const uploadedFile of uploadedFiles) {
      if (file.name === uploadedFile.name && file.size === uploadedFile.size) {
        console.log("File already uploaded: " + file.name);
        return true;
      }
    }
    console.log("File not uploaded: " + file.name);
    return false;
  };

  const resetAttachment = () => {
    fileInputRef.current.value = '';
    setFiles([]);
    setUploadedFiles([]);
    uploadedAttachmentsArray([]);
  };

  useEffect(() => {
    console.log("files", files);
  }, [files]);

  return (
    <>
      <div className="attachment-uploader col-md-4">
        <label htmlFor="file-input">
          <div className="select-file">
            <span className="text">Select file</span>
          </div>
        </label>
        <input id="file-input" type="file" onChange={handleFileSelect} className="px-1 py-1" ref={fileInputRef} style={{ height: 'auto' }} />
        <div className="file-list">
          {files.length > 0 && files.map((file, index) => {
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
      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => setToaster(false)}
        />
      )}
    </>
  );
};

export default AttachmentUploader;
