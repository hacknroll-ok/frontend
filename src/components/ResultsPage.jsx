// NextPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Typography } from "@material-tailwind/react";

const NextPage = () => {
  const location = useLocation();
  const { players } = location.state || {};
  const navigate = useNavigate();
  const TABLE_HEAD = ["Name", "Score"];
  function handleClick() {
    navigate("/");
  }

  return (
    <div className="flex justify-center items-center flex-col h-[100vh]">
      <h2 className="font-bold leading-snug tracking-normal text-slate-800 text-2xl lg:max-w-3xl lg:text-4xl mb-8">
        Results
      </h2>
      {/* <Card className="w-96">
        <List>
          {players.map((player) => (
            <ListItem key={player.id}>
              Name: {player.name} Score: {player.score}
            </ListItem>
          ))}
        </List>
        <Button onClick={handleClick}>Exit</Button>
      </Card> */}
      <Card className="w-[30vw]">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map(({ name, score }, index) => (
              <tr key={name} className="even:bg-blue-gray-50/50">
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {name}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {score}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button color="green" onClick={handleClick}>
          Exit
        </Button>
      </Card>
    </div>
  );
};

export default NextPage;
