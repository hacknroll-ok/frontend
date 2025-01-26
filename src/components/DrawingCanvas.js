import React, { useRef, useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const DrawingCanvas = ({
  players,
  setPlayers,
  playerIndex,
  setRoundNumber,
  isMyTurn,
  setIsMyTurn,
  setSubject,
  setPrediction,
  setSubmittedGuess,
  webSocket,
  setDrawingMessage,
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const myTurn = useRef(true);
  const playersRef = useRef(null);
  const navigate = useNavigate();
  // useEffect(() => {}, [players, message]);
  useEffect(() => {
    // Initialize WebSocket connection
    if (webSocket.current == null) {
      webSocket.current = new WebSocket("ws://127.0.0.1:8000/ws");
    }

    // WebSocket event handlers
    webSocket.current.onopen = () => {
      console.log("WebSocket connection established.");
    };

    webSocket.current.onmessage = (event) => {
      console.log("Message received from server:", event.data);

      // If the message is a Blob (image data), render it on the canvas
      // if (event.data instanceof Blob) {
      //   const canvas = canvasRef.current;
      //   const context = canvas.getContext("2d");
      //   const image = new Image();
      //   image.onload = () => {
      //     context.drawImage(image, 0, 0);
      //   };
      //   image.src = URL.createObjectURL(event.data);
      //   return; // Exit since it's not related to players or turns
      // }

      try {
        // Attempt to parse the message as JSON
        const message = JSON.parse(event.data);
        console.log("Parsed message:", message);
        console.log("type of parsed message", typeof message);
        console.log("message type:", message.type);
        console.log("myTurn?", myTurn.current);

        if (Array.isArray(message)) {
          console.log("Players array received:", message);
          setPlayers(message); // Update the players array directly
          playersRef.current = message;
        } else if (
          message.type === "newTurn"
          // ||
          // (message.round >= 0 &&
          //   message.playerDrawing !== undefined &&
          //   message.drawingSubject)
        ) {
          console.log("New turn message:", message);
          setDrawingMessage("Guess the Drawing!");
          webSocket.current.send(
            JSON.stringify({
              type: "drawing",
              state: "clear",
            })
          );
          setRoundNumber(message.round);
          setSubject(message.drawingSubject);
          setSubmittedGuess(false);
          console.log("players:", playersRef.current);
          let storedPlayerId = parseInt(sessionStorage.getItem("id"), 10);
          console.log("stored player id:", storedPlayerId);
          let currentPlayerIndex = playersRef.current.findIndex(
            (player) => player.id === storedPlayerId
          );
          const isCurrentPlayerTurn =
            message.playerDrawing === currentPlayerIndex;
          console.log("current player index:", currentPlayerIndex);

          //need set state and ref both hmm
          setIsMyTurn(isCurrentPlayerTurn);
          myTurn.current = isCurrentPlayerTurn;

          console.log(
            `Round ${message.round} started. Drawing subject: ${message.drawingSubject}.`
          );
          console.log(`Is it my turn to draw? ${myTurn.current}`);
        } else if (message.type === "drawing" && !myTurn.current) {
          // Render the drawing event on this client's canvas
          if (message.state === "ongoing") {
            contextRef.current.lineTo(message.x, message.y);
            contextRef.current.stroke();
          } else if (message.state === "start") {
            contextRef.current.beginPath();
            contextRef.current.moveTo(message.x, message.y);
          } else if (message.state === "stop") {
            contextRef.current.closePath();
          } else if (message.state === "clear") {
            const canvas = canvasRef.current;
            const context = contextRef.current;
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
        } else if (message.type === "end") {
          console.log("game has ended");
          webSocket.current.close(1000, "game has ended");
          navigate("/results", { state: { players: playersRef.current } });
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
            setPrediction(prediction);
          } else {
            console.warn("Unhandled string message:", event.data);
          }
        }
      }
    };

    webSocket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    webSocket.current.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    // Save the WebSocket instance in state
    // setWebSocket(ws);
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

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    if (isMyTurn) {
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);

      if (
        webSocket.current &&
        webSocket.current.readyState === WebSocket.OPEN
      ) {
        webSocket.current.send(
          JSON.stringify({
            type: "drawing",
            state: "start",
            x: offsetX,
            y: offsetY,
          })
        );
      }
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;

    // Draw locally
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    // Send drawing data to WebSocket
    if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
      webSocket.current.send(
        JSON.stringify({
          type: "drawing",
          state: "ongoing",
          x: offsetX,
          y: offsetY,
        })
      );
    }
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);

    if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
      webSocket.current.send(
        JSON.stringify({
          type: "drawing",
          state: "stop",
        })
      );
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
      webSocket.current.send(
        JSON.stringify({
          type: "drawing",
          state: "clear",
        })
      );
    }
  };

  const saveDrawing = () => {
    // Ensure the WebSocket connection is open
    if (!webSocket.current || webSocket.current.readyState !== WebSocket.OPEN) {
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

      webSocket.current.send(blob); // Send the blob data
      console.log("Canvas image sent over WebSocket!");
    }, "image/png");
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black", cursor: "crosshair" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      {isMyTurn && (
        <div className="flex gap-12 my-8 justify-center items-center">
          <Button size="lg" color="red" onClick={clearCanvas}>
            Clear
          </Button>
          <Button size="lg" color="green" onClick={saveDrawing}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default DrawingCanvas;
