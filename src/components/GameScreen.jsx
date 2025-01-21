import { Button, Input, Typography, Alert } from "@material-tailwind/react";
import DrawingCanvas from "./DrawingCanvas";
import React, { useEffect, useRef } from "react";
// import GameService from "../services/GameService";
// import { ws } from "./DrawingCanvas.js";

const PlayerList = ({ players }) => (
  <div className="space-y-2">
    {players.map((player, index) => (
      <div key={index} className="flex justify-between">
        <span className="text-lg">{player.name}</span>
        <span className="text-lg">{player.score} pts</span>
      </div>
    ))}
  </div>
);

export default function GameScreen() {
  // const [webSocket, setWebSocket] = React.useState(null); // State to hold WebSocket instance
  const webSocket = useRef(null);
  const [roundNumber, setRoundNumber] = React.useState(1);
  const [players, setPlayers] = React.useState([]);
  console.log("Players:", players);

  const [guess, setGuess] = React.useState("");
  const [isMyTurn, setIsMyTurn] = React.useState(false);
  // Drawing Subject if player's turn to draw
  const [subject, setSubject] = React.useState("");
  // AI Prediction of subject
  const [prediction, setPrediction] = React.useState("");

  const [submittedGuess, setSubmittedGuess] = React.useState(false);

  // Set if alert for guess result is shown or not
  const [isAlert, setIsAlert] = React.useState(false);
  // 0 == incorrect, 1 == corevt + AI predicted same thing, 2 == correct + AI wrong
  const [guessResult, setGuessResult] = React.useState(0);

  const [drawingMessage, setDrawingMessage] =
    React.useState("Guess the Drawing!");

  // Get player index in player[]
  const playerIndex = players.length - 1;
  console.log("playerIndex:", playerIndex);
  console.log(webSocket.current);

  useEffect(() => {}, [players]);

  const handleGuessSubmit = async (e) => {
    e.preventDefault();
    setDrawingMessage("Waiting for other players to submit their guess...");
    console.log("Submitted guess:", guess);
    setSubmittedGuess(true);
    // Check if submitted guess is correct
    if (guess === subject && prediction !== subject) {
      console.log("Correct guess! Point Awarded!");
      const roundTrackingObj = {
        type: "roundTracking",
        round: roundNumber,
        playerId: sessionStorage.getItem("id"),
        guess: "correct",
      };
      webSocket.current.send(JSON.stringify(roundTrackingObj));
      // try {
      //   GameService.guessCorrect(sessionStorage.getItem("id"), true);
      //   setGuessResult(2);
      // } catch (e) {
      //   console.error("Error submitting guess:", e);
      // }
    } else {
      // AI also predicted correctly
      const roundTrackingObj = {
        type: "roundTracking",
        round: roundNumber,
        playerId: sessionStorage.getItem("id"),
        guess: "wrong",
      };
      webSocket.current.send(JSON.stringify(roundTrackingObj));
      if (guess === subject) {
        setGuessResult(1);
      } else {
        setGuessResult(0);
      }

      // try {
      //   GameService.guessCorrect(sessionStorage.getItem("id"), false);
      // } catch (e) {
      //   console.error("Error submitting guess:", e);
      // }
    }

    setIsAlert(true);
    setGuess("");
    console.log(webSocket.current);
  };

  return (
    <div className="h-screen flex flex-col p-4 bg-gray-100">
      {/* Round Number - Top */}
      <div className="text-center text-2xl font-bold mb-4">
        Round {roundNumber} of 5
      </div>
      <div className="text-center mb-4">
        {isMyTurn ? `Your Turn! Draw a ${subject}` : drawingMessage}
      </div>

      {/* Middle Section */}
      <div className="flex-grow flex gap-4">
        {/* Players and Points - Middle Left */}
        <div className="w-1/4 min-w-40 bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Players</h2>
          <PlayerList players={players} />
          <h2 className="text-2xl font-semibold mt-10 mb-4">AI Prediction</h2>
          <div className="flex justify-between">
            <span className="text-lg">AI</span>
            <span className="text-lg">{prediction}</span>
          </div>
        </div>

        {/* Canvas - Middle Right */}
        <div className="flex-grow bg-white p-4 rounded-lg shadow">
          <DrawingCanvas
            players={players}
            setPlayers={setPlayers}
            playerIndex={playerIndex}
            setRoundNumber={setRoundNumber}
            isMyTurn={isMyTurn}
            setIsMyTurn={setIsMyTurn}
            setSubject={setSubject}
            setPrediction={setPrediction}
            setSubmittedGuess={setSubmittedGuess}
            webSocket={webSocket}
            setDrawingMessage={setDrawingMessage}
          />
        </div>
      </div>

      {/* Guess Input - not myTurn and 1st time we submit */}
      {!isMyTurn && !isAlert && !submittedGuess && (
        <div className="flex gap-2 mt-4 items-center">
          <Input
            label="Enter Your Guess"
            size="lg"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="flex-grow"
          />
          <Button
            size="lg"
            color="green"
            className="ml-10"
            onClick={handleGuessSubmit}
          >
            Submit
          </Button>
        </div>
      )}

      {isAlert && (
        <Alert
          open={isAlert}
          onClose={() => setIsAlert(false)}
          color={guessResult ? "green" : "red"}
          animate={{
            mount: { y: 0 },
            unmount: { y: 100 },
          }}
          className="justify-center"
        >
          <Typography variant="h6">
            {guessResult === 2
              ? "Correct guess! Point awarded!"
              : guessResult === 0
              ? `Wrong Guess! Correct answer is ${subject}!`
              : `AI predicted ${subject} correctly`}
          </Typography>
        </Alert>
      )}
    </div>
  );
}
