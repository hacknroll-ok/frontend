import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input
} from "@material-tailwind/react";
import { useState } from "react";

export default function NewGame() {

  const[roomNumber, setRoomNumber] = useState(null);

  const handleRoomNumber = (e) => {
    setRoomNumber(e.target.value);
  }

  const submitRoomNumber = () => {
    if (roomNumber != null) {
      const roomNumberInt = parseInt(roomNumber);
      if (Number.isInteger(roomNumberInt)) {
        console.log("Room Number: " + roomNumberInt);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-1/4 min-w-96">
        <CardHeader
          variant="gradient"
          color="green"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white"> Create New Game </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 justify-center w-full">
          <Input 
            size="lg" 
            label="Enter Room Number"
            onChange={(e) => handleRoomNumber(e)}
          />
          <a href="/JoinGame" className="flex justify-center">
            <Button size="md" color="white" className="border-2 border-black" onClick={() => submitRoomNumber()}> Create</Button>
          </a>
        </CardBody>
      </Card>
    </div>
  );
}