import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { uploadProfileImage } from "../../services/user/api";

const ImageUpload = (props) => {

    const {
      setProfileImage,
      selectedProfilePic,
      showToasterBool,
      showToasterMessage,
    } = props;
    console.log(selectedProfilePic)
    const [selectedImage, setSelectedImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [showUploadButton, setShowUploadButton] = useState(false);


    useEffect(() => {
        if (selectedProfilePic) {
            setImageUrl(selectedProfilePic)
            setSelectedImage(selectedProfilePic)
        }
    }, [selectedProfilePic])



    const handleImageChange = async(event) => {
        const selectedImage = event.target.files[0];
        console.log(selectedImage)
        if (selectedImage && selectedImage.type.startsWith("image/")) {
            setSelectedImage(selectedImage);
            setImageUrl(URL.createObjectURL(selectedImage))
            setShowUploadButton(true)
             if (!selectedImage) {
            alert("Please select an image file");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedImage);

            const response = await uploadProfileImage(formData);
            if (response.error) {
                console.log('Error while Updating details');
                setLoading(false);
                return;
            } else {
              setProfileImage(response.url);
              
              setLoading(false);
             showToasterBool();
              showToasterMessage();
            }
        } catch (error) {
            console.log('Error while Updating details');
            setLoading(false);
            return error.message;
            
        }
           
            // document.getElementById("uploadButton")?.click();
        } else {
            setSelectedImage('');
            alert("Please select a valid image file (jpg, png, gif)");
        }
    };


    const deleteImage = async () => {
         setSelectedImage(null);
         setImageUrl(null);
        setShowUploadButton(false);
                setProfileImage(null);

        
       
   }
    return (
      <>
        <>
          <div className="image-upload">
            <label htmlFor="image-input">
              {imageUrl ? (
                <div>
                  <img src={imageUrl} alt="Preview" />
                  <div className="upload-icon">
                    <i
                      style={{ cursor: "pointer" }}
                      className="fas fa-edit"
                    ></i>
                  </div>

                  {/* <button onClick={resetImageValues}>Edit</button> */}
                </div>
              ) : (
                <div className="upload-icon">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>Select an image file</span>
                </div>
              )}
            </label>

            {
              <input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            }
            {/* {
                    showUploadButton && <>
                        <button type="button" id="uploadButton" onClick={uploadProfilePicture}> Upload</button>
                    </>
                } */}
          </div>

          {loading ? <Loader /> : null}
        </>
            {imageUrl&&<i style={{ cursor: "pointer" }} onClick={deleteImage} className="fas fa-trash"></i>}
      </>
    );
};

export default ImageUpload;
