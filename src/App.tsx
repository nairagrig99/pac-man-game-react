import './App.css'
import GameBoard from "./game-board/GameBoard.tsx";
import {useState} from "react";

function App() {
    const [gameId, setGameId] = useState<number>(0);

    return (
        <>
            <GameBoard key={gameId} setId={setGameId}/>
        </>
    )
}

export default App
