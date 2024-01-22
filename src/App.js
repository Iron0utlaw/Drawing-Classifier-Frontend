import React, { useState, useRef } from 'react';
import Canvas from './components/Canvas';
import axios from 'axios';

const App = () => {
  const canvasRef = useRef(null);
  const [predictionStatus, setPredictionStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Define the base URL based on the environment
  const baseURL = process.env.VERCEL_ENV === 'production'
    ? 'https://drawing-classifier.onrender.com'
    : 'http://127.0.0.1:5000';

  const handleButtonClick = async (endpoint) => {
    const canvas = canvasRef.current;
    const blob = await canvas.getImageBlob();
    const formData = new FormData();
    formData.append('image', blob);

    try {
      await axios.post(`${baseURL}/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error(`Error uploading or retrieving image to ${endpoint}:`, error);
    }
  };

  const handleButtonClickPred = async () => {
    const endpoint = 'upload_pred';
    await handleButtonClick(endpoint);

    try {
      setLoading(true);
      await axios.get(`${baseURL}/train`);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const pred = async () => {
    const endpoint = 'pred';
    try {
      const response = await fetch(`${baseURL}/${endpoint}`);
      const data = await response.json();
      setPredictionStatus(data.status);
    } catch (error) {
      console.error(`Error fetching prediction from ${endpoint}:`, error);
    }
  };

  return (
    <div>
      <Canvas ref={canvasRef} />
      <button className='p-5 bg-amber-500' onClick={() => handleButtonClick('uploadA')}>
        Upload Image A
      </button>
      <button className='p-5 bg-amber-500' onClick={() => handleButtonClick('uploadB')}>
        Upload Image B
      </button>
      <button className='p-5 bg-amber-500' onClick={() => handleButtonClick('uploadC')}>
        Upload Image C
      </button>
      <button className='p-5 bg-amber-500' onClick={handleButtonClickPred}>
        {loading ? 'Loading' : 'Upload Pred'}
      </button>
      <button className='p-5 bg-amber-500' onClick={pred}>
        Pred
      </button>
      {predictionStatus && <p>Prediction: {predictionStatus}</p>}
    </div>
  );
};

export default App;
