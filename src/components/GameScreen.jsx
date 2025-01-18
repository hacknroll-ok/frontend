import {
    Button,
    Input,
    Typography,
    Card
  } from "@material-tailwind/react";
  import DrawingCanvas from "./DrawingCanvas";
  import React from "react";
  import GameService from "../services/GameService";
  
  
  const PlayerList = ({ players }) => (
    <div className="space-y-2">
      {players.map((player, index) => (
        <div key={index} className="flex justify-between">
          <span className="text-lg">{player.name}</span>
          <span className="text-lg">{player.points} pts</span>
        </div>
      ))}
    </div>
  )
  
  
  export default function GameScreen() {
  
    const [roundNumber, setRoundNumber] = React.useState(1)
    const [players, setPlayers] = React.useState([
      { name: "AI", points: 0 },
      { name: "Player 2", points: 0 },
      { name: "Player 3", points: 0 },
      { name: "Player 4", points: 0 },
      { name: "Player 5", points: 0 },
    ])

    const [guess, setGuess] = React.useState("")
  
    const handleGuessSubmit = async (e) => {
      e.preventDefault()
      console.log("Submitted guess:", guess)
      GameService.sendGuess(1, guess)
      setGuess("")
      // Here you would typically handle the guess submission logic
    }
  
  
    return (
      <div className="h-screen flex flex-col p-4 bg-gray-100">
        {/* Round Number - Top */}
        <div className="text-center text-2xl font-bold mb-4">
          Round {roundNumber} of 5
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
            <DrawingCanvas />
          </div>
        </div>
  
        {/* Guess Input - Bottom */}
        <div className="flex gap-2 mt-4 items-center">
          <Input
            label="Enter Your Guess"
            size="lg"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="flex-grow"
          />
          <Button size="lg" color="green" className="ml-10">Submit</Button>
        </div>
      </div>
    );
  
  
  }