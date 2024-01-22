import React, { useEffect, useState } from 'react';
import Home from './Home';
import { Spinner } from '@chakra-ui/react';
import axios from 'axios';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        await axios.get('https://drawing-classifier.onrender.com/');
        setLoading(false);
      } catch (error) {
        console.error('Backend is not live:', error);
      }
    };

    checkBackendStatus();
  }, []);

  return (
    <div className="flex bg-black items-center justify-center h-screen">
      {loading ? (
        <Spinner color='white' />
      ) : (
        <div className="animate-slide-up w-[90%] md:w-[50%] h-screen">
          <Home />
        </div>
      )}
    </div>
  );
};

export default App;
