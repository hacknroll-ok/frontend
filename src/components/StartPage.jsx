import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button
} from "@material-tailwind/react";

export default function StartPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Card className="w-1/4 min-w-96">
                <CardHeader
                    variant="gradient"
                    color="green"
                    className="mb-4 grid h-28 place-items-center"
                >
                    <Typography variant="h3" color="white"> Game Name </Typography>
                </CardHeader>
                <CardBody className="flex gap-8 justify-between">
                    <a href="/NewGame">
                        <Button size="lg" color="white" className="border-2 border-blue-400"> Create New Game</Button>
                    </a>
                    <a href="/JoinGame">
                        <Button size="lg" color="white" className="border-2 border-red-400"> Join Game</Button>
                    </a>
                </CardBody>
            </Card>
        </div>
    );
}