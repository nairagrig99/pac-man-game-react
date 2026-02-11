import {create} from "zustand/react";
import type {PositionType} from "../game-board/GameBoard.tsx";

type ObstacleState = {
    boundaries: HTMLDivElement;
    obstacles: PositionType[],
    setBoundaries: (boundaries: HTMLDivElement) => void,
    setObstacles: (obstacles: PositionType[]) => void,
}

export const useObstacles = create<ObstacleState>((set) => ({
    boundaries: null,
    obstacles: [],
    setBoundaries: (boundaries) => {
        set({boundaries})
    },
    setObstacles: (obstacles) => {
        set({obstacles})
    }
}))