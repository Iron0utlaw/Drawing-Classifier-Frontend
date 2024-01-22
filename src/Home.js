import axios from "axios";
import React, { useRef, useState } from "react";
import Canvas from "./components/Canvas";
import { Button, Text } from "@chakra-ui/react";

const Home = () => {
  const canvasRef = useRef(null);
  const [predictionStatus, setPredictionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [train, setTrained] = useState(false);

  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://drawing-classifier.onrender.com"
      : "http://127.0.0.1:5000";

  const handleButtonClick = async (endpoint) => {
    const canvas = canvasRef.current;
    const blob = await canvas.getImageBlob();
    const formData = new FormData();
    formData.append("image", blob);

    try {
      await axios.post(`${baseURL}/${endpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error(
        `Error uploading or retrieving image to ${endpoint}:`,
        error
      );
    }

    if (endpoint !== "upload_pred") clear();
  };

  const handleButtonClickTrain = async () => {
    try {
      setLoading(true);
      await axios.get(`${baseURL}/train`);
      setLoading(false);
      setTrained(true);
    } catch (error) {
      console.log(error);
    }
  };

  const UploadPred = async () => {
    const endpoint = "pred";
    const endpoint_upload = "upload_pred";
    await handleButtonClick(endpoint_upload);
    try {
      const response = await fetch(`${baseURL}/${endpoint}`);
      const data = await response.json();
      setPredictionStatus(data.status);
    } catch (error) {
      console.error(`Error fetching prediction from ${endpoint}:`, error);
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas && canvas.clearCanvas) {
      canvas.clearCanvas();
      setPredictionStatus(null);
    }
  };

  return (
    <div className="flex flex-col bg-black justify-center items-center h-screen">
      <div className="flex flex-col w-[90%] md:w-[80%] bg-white p-5 md:p-10 rounded-xl gap-4 mx-auto">
        <Canvas ref={canvasRef} />
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              colorScheme="blue"
              onClick={() => handleButtonClick("uploadA")}
            >
              Upload A
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => handleButtonClick("uploadB")}
            >
              Upload B
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => handleButtonClick("uploadC")}
            >
              Upload C
            </Button>
            <Button colorScheme="blue" onClick={clear}>
              Clear
            </Button>
            <Button
              isLoading={loading}
              colorScheme="green"
              onClick={handleButtonClickTrain}
            >
              {loading ? "Training..." : "Train"}
            </Button>
            <Button
              isDisabled={!train}
              colorScheme="green"
              onClick={UploadPred}
            >
              Predict
            </Button>
          </div>
          <Text border="2px" borderColor="gray.200" className="h-20 p-3">
            Most Probably: {predictionStatus}
          </Text>
        </div>
      </div>
    </div>
  );
  
};

export default Home;
