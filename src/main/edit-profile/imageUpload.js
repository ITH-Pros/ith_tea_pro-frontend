import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { uploadProfileImage } from "../../services/user/api";

const ImageUpload = (props) => {

    const { setProfileImage, selectedProfilePic } = props
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



    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        console.log(selectedImage)
        if (selectedImage && selectedImage.type.startsWith("image/")) {
            setSelectedImage(selectedImage);
            setImageUrl(URL.createObjectURL(selectedImage))
            setShowUploadButton(true)
        } else {
            setSelectedImage('');
            alert("Please select a valid image file (jpg, png, gif)");
        }
    };


    const uploadProfilePicture = async () => {
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
            }
        } catch (error) {
            console.log('Error while Updating details');
            setLoading(false);
            return error.message;
        }
    };

    return (
        <>
            <div className="image-upload">
                <label htmlFor="image-input">

                    {imageUrl ?
                        <div>
                            <img src={imageUrl} alt="Preview" />
                            {/* <button onClick={resetImageValues}>Edit</button> */}
                        </div>
                        :
                        <div className="upload-icon">
                            <i className="fas fa-cloud-upload-alt"></i>
                            <span>Select an image file</span>
                        </div>
                    }
                </label>
                {!selectedImage &&
                    <input
                        id="image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                }
                {
                    showUploadButton && <>
                        <button type="button" onClick={uploadProfilePicture}> Upload</button>
                    </>
                }
            </div>

            {loading ? <Loader /> : null}

        </>


    );
};

export default ImageUpload;
