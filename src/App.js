import React, { useEffect, useState } from 'react';
import Home from './Home';

const App = () => {
  const [loading,setLoading] = useState(true)
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        await fetch('https://drawing-classifier.onrender.com/');
        setLoading(false);
      } catch (error) {
        console.error('Backend is not live:', error);
      }
    };

    checkBackendStatus();
  }, []);
  return <>
    {loading ? <>Loading</> : <Home/>}
  </>
};

export default App;
