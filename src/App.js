import StartPage from "./components/StartPage"
import NewGame from "./components/NewGame"
import JoinGame from "./components/JoinGame"
import GameScreen from "./components/GameScreen"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
   return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/NewGame" element={<NewGame />} />
        <Route path="/JoinGame" element={<JoinGame />} />
        <Route path="/GameScreen" element={<GameScreen />} />
      </Routes>
    </Router>
   );

}