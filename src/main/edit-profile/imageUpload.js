import React, { useState } from "react";

const ImageUpload = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage && selectedImage.type.startsWith("image/")) {
      setImage(selectedImage);
    } else {
      setImage(null);
      alert("Please select a valid image file (jpg, png, gif)");
    }
  };
    const handleSubmit = (event) => {
      event.preventDefault();
 if (!image) {
      alert("Please select an image file");
      return;
    }

      const formData = new FormData();
      formData.append("file", image);

      fetch("http://192.168.29.240:9000/upload/v1/upload/file", {
        method: "PUT",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    };

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     if (!image) {
//       alert("Please select an image file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", image);

//     fetch("http://your-api-endpoint.com/upload", {
//       method: "POST",
//       body: formData,
//     })
//       .then((response) => response.json())
//       .then((data) => console.log(data))
//       .catch((error) => console.error(error));
//   };

  return (
    <div className="image-upload">
      <label htmlFor="image-input">
        <div className="upload-icon">
          <i className="fas fa-cloud-upload-alt"></i>
        </div>
        {image ? (
          <img src={URL.createObjectURL(image)} alt="Preview" />
        ) : (
          <span>Select an image file</span>
        )}
      </label>
      <input
        id="image-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <button onClick={handleSubmit} disabled={!image}>
        Upload
      </button>
    </div>
  );
};

export default ImageUpload;