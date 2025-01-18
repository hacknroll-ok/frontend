import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Input
} from "@material-tailwind/react";

export default function EnterPage() {
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
                    <Input label="Enter Your Name" size="lg" />
                </CardBody>
            </Card>
        </div>
    );
}