import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { uploadProfileImage } from "../../services/user/api";

const ImageUpload = (props) => {
  const {
    setProfileImage,
    selectedProfilePic,
    showToasterBool,
    showToasterMessage,
    isEditable,
  } = props;
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProfilePic) {
      setImageUrl(selectedProfilePic);
    }
  }, [selectedProfilePic]);

  const handleImageChange = async (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage && selectedImage.type.startsWith("image/")) {
      setImageUrl(URL.createObjectURL(selectedImage));
      if (!selectedImage) {
        alert("Please select an image file");
        return;
      }
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", selectedImage);
        
        const response = await uploadProfileImage(formData);
        setLoading(false);
        if (response.error) {
          console.log("Error while Updating details");
          return;
        } else {
          setProfileImage(response.url);
          setLoading(false);
          showToasterBool();
          showToasterMessage();
        }
      } catch (error) {
        console.log("Error while Updating details");
        setLoading(false);
        return error.message;
      }
    } else {
      alert("Please select a valid image file (jpg, png, gif)");
    }
  };

  const deleteImage = async () => {
    setImageUrl(null);
    setProfileImage(null);
  };
  return (
    <>
      <>
        <div className="image-upload">
          <label htmlFor="image-input">
            {imageUrl ? (
              <div>
                <img src={imageUrl} alt="Preview" />
                <div className="upload-icon">
                  {isEditable && (
                    <i
                      style={{ cursor: "pointer" }}
                      className="fas fa-edit"
                    ></i>
                  )}
                </div>
              </div>
            ) : (
              <div className="upload-icon">
                {isEditable && <i className="fas fa-cloud-upload-alt"></i>}
                {isEditable && <span>Select an image file</span>}
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
        </div>
        {loading ? <Loader /> : null}
      </>
      {imageUrl && isEditable && (
        <i
          style={{ cursor: "pointer" }}
          onClick={deleteImage}
          className="fas fa-trash"
        ></i>
      )}
    </>
  );
};

export default ImageUpload;
