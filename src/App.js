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
      const response = await axios.post('https://drawing-classifier.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
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
