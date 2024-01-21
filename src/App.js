// src/App.js
import React, { useState, useRef } from 'react';
import Canvas from './components/Canvas';
import axios from 'axios';

const App = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const canvasRef = useRef(null);

  const handleButtonClick = async () => {
    const canvas = canvasRef.current;
    const blob = await canvas.getImageBlob();

    const formData = new FormData();
    formData.append('image', blob);

    try {
      // Upload the image
      const responseUpload = await axios.post('https://drawing-classifier.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImageUrl(responseUpload.data.imageUrl);

      // Retrieve the uploaded image
      const responseGetImage = await axios.get('https://drawing-classifier.onrender.com/get_uploaded_image', {
        responseType: 'blob', // Ensure the response is treated as a blob
      });

      // Create a URL for the blob and set it as the image URL
      const blobUrl = URL.createObjectURL(responseGetImage.data);
      setImageUrl(blobUrl);
    } catch (error) {
      console.error('Error uploading or retrieving image:', error);
    }
  };

  return (
    <div>
      <Canvas ref={canvasRef} />
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
      <button className='p-5 bg-amber-500' onClick={handleButtonClick}>
        Upload Image
      </button>
    </div>
  );
};

export default App;
