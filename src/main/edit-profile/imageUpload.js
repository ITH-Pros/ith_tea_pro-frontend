import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { uploadProfileImage } from "../../services/user/api";
import Badge from "react-bootstrap/Badge";

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
  const [inputKey, setInputKey] = useState(Date.now());

  useEffect(() => {
    if (selectedProfilePic) {
      setImageUrl(selectedProfilePic);
    }
  }, [selectedProfilePic]);

  const handleImageChange = async (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage && selectedImage.type.startsWith("image/")) {
      if (selectedImage.size > 5 * 1024 * 1024) {
        alert(
          `Please select an image file that is less than or equal to 5MB. The selected file size is ${
            Math.round((selectedImage.size / 1024 / 1024) * 100) / 100
          }MB`
        );
        return;
      }
      setImageUrl(URL.createObjectURL(selectedImage));
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
      setInputKey(Date.now());
    } else {
      alert("Please select a valid image file (jpg, png, gif)");
    }
  };

  const deleteImage = async () => {
    setImageUrl(null);
    setProfileImage(null);
    setInputKey(Date.now());
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
                    <Badge bg="secondary">
                      <i
                        style={{ cursor: "pointer" }}
                        className="fas fa-edit"
                      ></i>
                    </Badge>
                  )}
                  {imageUrl && isEditable && (
                    <Badge bg="danger" size="sm">
                      <i
                        style={{ cursor: "pointer" }}
                        onClick={deleteImage}
                        className="fas fa-trash"
                      ></i>
                    </Badge>
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
              key={inputKey}
              id="image-input"
              type="file"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleImageChange}
            />
          }
        </div>
        {loading ? <Loader /> : null}
      </>
    </>
  );
};

export default ImageUpload;
