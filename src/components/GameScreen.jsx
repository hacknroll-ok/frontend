import {
  Button,
  Input,
  Typography,
  Alert
} from "@material-tailwind/react";
import DrawingCanvas from "./DrawingCanvas";
import React, { useEffect } from "react";
import GameService from "../services/GameService";
import UserService from "../services/UserService";


const PlayerList = ({ players }) => (
  <div className="space-y-2">
    {players.map((player, index) => (
      <div key={index} className="flex justify-between">
        <span className="text-lg">{player.name}</span>
        <span className="text-lg">{player.score} pts</span>
      </div>
    ))}
  </div>
)


export default function GameScreen() {

  const [roundNumber, setRoundNumber] = React.useState(1)
  const [players, setPlayers] = React.useState([])
  console.log("Players:", players)

  const [guess, setGuess] = React.useState("")
  const [isMyTurn, setIsMyTurn] = React.useState(false)
  // Drawing Subject if player's turn to draw
  const [subject, setSubject] = React.useState("")

  // Set if alert for guess result is shown or not
  const [isAlert, setIsAlert] = React.useState(false)
  const [guessResult, setGuessResult] = React.useState(false)


  // Get player index in player[]
  const playerIndex = players.length - 1
  
  useEffect(() => {
  }, [players])

  const handleGuessSubmit = async (e) => {
    e.preventDefault()
    console.log("Submitted guess:", guess)
    // Check if submitted guess is correct
    if (guess === subject) {
      console.log("Correct guess!")
      try {
        await GameService.guessCorrect(sessionStorage.getItem("id"))
        setGuessResult(true)
      } catch (e) {
        console.error("Error submitting guess:", e)
      }
    } else {
      console.log("Incorrect guess!")
      setGuessResult(false)
    }
    setIsAlert(true)
    setGuess("")
  }


  return (
    <div className="h-screen flex flex-col p-4 bg-gray-100">
      {/* Round Number - Top */}
      <div className="text-center text-2xl font-bold mb-4">
        Round {roundNumber} of 5
      </div>  
      <div className="text-center mb-4">
        {isMyTurn ? `Your Turn! Draw a ${subject}` : "Guess the Drawing!"}
      </div>

      {/* Middle Section */}
      <div className="flex-grow flex gap-4">
        {/* Players and Points - Middle Left */}
        <div className="w-1/4 min-w-40 bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Players</h2>
          <PlayerList players={players} />
        </div>

        {/* Canvas - Middle Right */}
        <div className="flex-grow bg-white p-4 rounded-lg shadow">
          <DrawingCanvas
            players={players}
            setPlayers={setPlayers}
            playerIndex={playerIndex}
            setRoundNumber={setRoundNumber}
            setIsMyTurn={setIsMyTurn}
            setSubject={setSubject}
          />
        </div>
      </div>

      {/* Guess Input - not myTurn */}
      {!isMyTurn && !isAlert &&
        <div className="flex gap-2 mt-4 items-center">
          <Input
            label="Enter Your Guess"
            size="lg"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="flex-grow"
          />
          <Button size="lg" color="green" className="ml-10" onClick={handleGuessSubmit}>Submit</Button>
        </div>}

      {/* Guess Input - myTurn */}
      {isMyTurn &&
        <div className="flex gap-2 mt-4 items-center justify-center">
          <Typography variant="h4" color="black">You are drawing:
            <span className="text-red-500 underline">{subject}</span>
          </Typography>
        </div>}

      {isAlert &&
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
          <Typography
            variant="h6"
          >
            {guessResult ? "Correct guess!" : "Incorrect guess!"}
          </Typography>
        </Alert>}
    </div>
  );


}