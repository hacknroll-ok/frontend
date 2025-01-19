import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@material-tailwind/react";

const DrawingCanvas = ({ players, setPlayers, playerIndex, setRoundNumber, isMyTurn, setIsMyTurn, setSubject, setPrediction, setSubmittedGuess }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [webSocket, setWebSocket] = useState(null); // State to hold WebSocket instance

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket('ws://127.0.0.1:8000/ws');

    // WebSocket event handlers
    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      console.log("Message received from server:", event.data);

      // If the message is a Blob (image data), render it on the canvas
      if (event.data instanceof Blob) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const image = new Image();
        image.onload = () => {
          context.drawImage(image, 0, 0);
        };
        image.src = URL.createObjectURL(event.data);
        return; // Exit since it's not related to players or turns
      }

      try {
        // Attempt to parse the message as JSON
        const message = JSON.parse(event.data);
        console.log("Parsed message:", message);

        if (message.type === "drawing") {
          // Render the drawing event on this client's canvas
          contextRef.current.lineTo(message.x, message.y);
          contextRef.current.stroke();
        }

        if (Array.isArray(message)) {
          console.log("Players array received:", message);
          setPlayers(message); // Update the players array directly
        } else if (message.type === "newTurn" || (message.round >= 0 && message.playerDrawing !== undefined && message.drawingSubject)) {
          console.log("New turn message:", message);

          setRoundNumber(message.round);
          setSubject(message.drawingSubject);
          setSubmittedGuess(false)
          
          const isCurrentPlayerTurn = message.playerDrawing === parseInt(sessionStorage.getItem("id"), 10);
          setIsMyTurn(isCurrentPlayerTurn);
          
          console.log(`Round ${message.round} started. Drawing subject: ${message.drawingSubject}.`);
          console.log(`Is it my turn to draw? ${isCurrentPlayerTurn}`);
        } else {
          console.warn("Unhandled message type or format:", message);
        }
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);

        // Handle non-JSON messages
        if (typeof event.data === "string") {
          console.log("Non-JSON message received:", event.data);

          // Example: Handle "Prediction: snake" messages
          if (event.data.startsWith("Prediction:")) {
            const prediction = event.data.replace("Prediction:", "").trim();
            console.log(`AI predicted the drawing as: ${prediction}`);
            setPrediction(prediction)
          } else {
            console.warn("Unhandled string message:", event.data);
          }
        }
      }


    };


    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    // Save the WebSocket instance in state
    setWebSocket(ws);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  useEffect(() => {
    const canvas = canvasRef.current;
    const parentDiv = canvas.parentElement;
    const width = parentDiv.offsetWidth;
    const height = window.innerHeight * (7 / 10);

    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    if (isMyTurn) {
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;

    // Draw locally
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    // Send drawing data to WebSocket
    // if (webSocket && webSocket.readyState === WebSocket.OPEN) {
    //     webSocket.send(JSON.stringify({
    //       type: "drawing",
    //       x: offsetX,
    //       y: offsetY
    //     }));
    //   };
  };



  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    // Ensure the WebSocket connection is open
    if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket connection is not open.");
      return;
    }

    // Get the canvas reference
    const canvas = canvasRef.current;

    // Convert the canvas to a blob and send it over WebSocket
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Failed to convert canvas to blob.");
        return;
      }

      webSocket.send(blob); // Send the blob data
      console.log("Canvas image sent over WebSocket!");
    }, "image/png");
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid black', cursor: 'crosshair' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      {isMyTurn && <div className="flex gap-12 my-8 justify-center items-center">
        <Button size="lg" color="red" onClick={clearCanvas}>Clear</Button>
        <Button size="lg" color="green" onClick={saveDrawing}>Save</Button>
      </div>}
    </div>
  );
};

export default DrawingCanvas;
