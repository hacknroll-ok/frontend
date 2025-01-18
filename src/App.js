import StartPage from "./components/StartPage"
import NewGame from "./components/NewGame"
import JoinGame from "./components/JoinGame"
import GameScreen from "./components/GameScreen"
import EnterName from "./components/EnterName"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
   return (
    <Router>
      <Routes>
        <Route path="/" element={<EnterName />} />
        <Route path="/newGame" element={<NewGame />} />
        <Route path="/joinGame" element={<JoinGame />} />
        <Route path="/enterName" element={<EnterName />} />
        <Route path="/game" element={<GameScreen />} />
      </Routes>
    </Router>
   );

}