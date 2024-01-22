import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

const Canvas = forwardRef(({ onImageReady }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useImperativeHandle(ref, () => ({
    getImageBlob: async () => {
      return new Promise((resolve) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const tempCanvas = document.createElement("canvas");
        const tempContext = tempCanvas.getContext("2d");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempContext.fillStyle = "white";
        tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempContext.drawImage(canvas, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(tempCanvas, 0, 0);

        canvas.toBlob((blob) => {
          resolve(blob);
        });
      });
    },
    clearCanvas: () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
    },
  }));

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { offsetX, offsetY } = getCoordinates(e);

    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { offsetX, offsetY } = getCoordinates(e);

    context.lineTo(offsetX, offsetY);
    context.lineWidth = 5;
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
    };
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)" }}
    />
  );
});

export default Canvas;
