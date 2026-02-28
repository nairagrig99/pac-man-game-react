import {create} from "zustand/react";
import type {PositionType} from "../game-board/GameBoard.tsx";

type ObstacleState = {
    boundaries: HTMLDivElement;
    obstacles: PositionType[],
    dots: PositionType[],
    setBoundaries: (boundaries: HTMLDivElement) => void,
    setObstacles: (obstacles: PositionType[]) => void,
    setDots: (dots: PositionType[]) => void
}

export const useObstacles = create<ObstacleState>((set) => ({
    boundaries: null,
    obstacles: [],
    dots: [],
    setBoundaries: (boundaries) => {
        set({boundaries});
    },
    setObstacles: (obstacles) => {
        set({obstacles});
    },
    setDots: (dots) => {
        set({dots});
    }
}))