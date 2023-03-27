import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFile, FaTrash } from "react-icons/fa";
import { uploadProfileImage } from "../../../services/user/api";
import Loader from "../../../components/Loader";


const AttachmentUploader = (props) => {
    const { taskAttachments, selectedProjectFromTask, uploadedAttachmentsArray } = props
    console.log("taskAttachments---------->", taskAttachments, selectedProjectFromTask)
    const [files, setFiles] = useState(taskAttachments || []);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // const [loading, setLoading] = useState(false);

    useEffect(() => { uploadedAttachmentsArray(uploadedFiles); console.log(uploadedFiles, "----------------------uploadedFiles"); }, [uploadedFiles]);


    const handleFileSelect = (event) => {
        const newFiles = [...event.target.files];
        console.log("newFiles", newFiles)
        let newUrls = []
        newFiles.forEach(async (file, index) => {
            console.log('calling file------>', file)
            try {
                const formData = new FormData();
                formData.append("file", file);
                const response = await uploadProfileImage(formData)

                if (response.error) {
                    console.log('Error while Updating details');
                    return;
                } else {
                    newUrls.push(response?.data?.url)
                }
                console.log("index   ", index, newFiles.length)
                if (index === newFiles.length - 1) {
                    setUploadedFiles([...taskAttachments, ...newUrls]);
                    setFiles([...files, ...newUrls]);
                    console.log("UPDADADADAE", taskAttachments, ...newUrls)
                    uploadedAttachmentsArray([...taskAttachments, ...newUrls])
                    // setLoading(false)
                }



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
        <div className="attachment-uploader col-md-4">
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

            />
            <div className="file-list">
                {files.map((file, index) => {
                    console.log(file)
                    return (
                        <div className="file" key={index}>
                            <a target='_blank' className="fa fa-square" href={file}  ></a> {' '}
                            <span className="name">{file?.name || 'Attachment ' + (index + 1)}</span>
                            {/* <button
                            className="delete-button"
                            onClick={() => handleDelete(file)}
                        >
                            <FaTrash />
                        </button> */}
                        </div>)
                })
                }
            {/* {loading ? <Loader /> : null} */}
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
