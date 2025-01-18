import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Input,
    Button
} from "@material-tailwind/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";

export default function EnterPage() {

    const [name, setName] = React.useState("")
    const [error, setError] = React.useState(false)
    const navigate = useNavigate()

    const submitName = async (e) => {
        e.preventDefault()
        try { 
            console.log("Submitted name:", name)
            const response = await UserService.sendName({"name": name})
            setError(false)
            // Set user id in session storage
            console.log("User ID:", response.data)
            sessionStorage.setItem("id", response.data.userId)
            navigate("/game")


        } catch (error) {
            console.error("Error submitting name:", error)
            setError(true)
        }
    }
        

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Card className="w-80">
                <CardHeader
                    variant="gradient"
                    color="blue"
                    className="mb-4 grid h-28 place-items-center"
                >
                    <Typography variant="h3" color="white"> Game Name </Typography>
                </CardHeader>
                <CardBody>
                    <Input label="Enter Your Name" size="lg" value={name} onChange={(e) => setName(e.target.value)} />
                    <Button size="md" color="green" className="w-full mt-4" onClick={submitName}> Start Game </Button>
                    {error && <Typography color="red" className="w-full justify-center"> Error submitting name. Try again.</Typography>}
                </CardBody>
            </Card>
        </div>
    );
}