import {useEffect, useRef} from "react";
import {KeyDownEnum} from "../enums/keyDown-enum.ts";
import {useObstacles} from "../State/store.ts";
import UseBoundaryDetection from "../Hooks/useBoundaryDetection.ts";
import useClientRect from "../Hooks/useClientRect.ts";
import type {PositionType} from "./GameBoard.tsx";
import {memo} from 'react';

const Player = memo(function Player() {

    const playerRef = useRef<HTMLDivElement>(null);
    const boundary = useRef<HTMLDivElement>(null);
    const obstacleRef = useRef<PositionType[]>([]);
    const stoneState = useRef<PositionType[]>([]);

    const useBoundaryDetection = UseBoundaryDetection();
    const {boundaries, obstacles, dots} = useObstacles();

    const movePoints = {x: 5, y: 10};
    const MOVEMENT_DELAY = 20;
    const rect = useClientRect();

    const directionIntervals = {
        downInterval: 0,
        upInterval: 0,
        leftInterval: 0,
        rightInterval: 0,
    }

    const state = {
        current: 0,
        previous: 0,
    }

    const movementPositions = {
        downInterval: 0,
        upInterval: 0,
        leftInterval: 0,
        rightInterval: 0,
    }

    // console.log("second compoent");
    // 1. First, create a ref to store pre-calculated bounds
    const obstacleBounds = useRef([]);

// 2. Update these bounds ONLY when obstacles change (not every frame!)
    useEffect(() => {
        obstacleBounds.current = obstacles.map(obs => {
            const r = rect(obs.element);
            return {
                x: obs.x,
                y: obs.y,
                right: obs.x + r.width,
                bottom: obs.y + r.height
            };
        });
    }, [obstacles]);


    const checkObstacleCollision = (position) => {
        const PLAYER_SIZE = 20;
        const threshold = 1;
        return obstacleBounds.current.some((obs) => {
            return (
                position.x + threshold < obs.right &&
                position.x + PLAYER_SIZE - threshold > obs.x &&
                position.y + threshold < obs.bottom &&
                position.y + PLAYER_SIZE - threshold > obs.y
            );
        });
    };

    const handleKeyDown = ((event) => {
        state.previous = state.current;
        const intervals = Object.values(directionIntervals)

        intervals.forEach((interval) => clearInterval(interval));
        if (event.key === KeyDownEnum.DOWN) handleDownMovement();
        if (event.key === KeyDownEnum.UP) handleUPMovement();
        if (event.key === KeyDownEnum.LEFT) handleLeftMovement();
        if (event.key === KeyDownEnum.RIGHT) handleRightMovement();
    });

    const handleDownMovement = () => {
        directionIntervals.downInterval = setInterval(() => {
            movePlayer({x: movePoints.x, y: movePoints.y++}, directionIntervals.downInterval, 'downInterval')
        }, MOVEMENT_DELAY)
        state.current = directionIntervals.downInterval
    }

    const handleRightMovement = () => {
        directionIntervals.rightInterval = setInterval(() => {
            movePlayer({x: movePoints.x++, y: movePoints.y}, directionIntervals.rightInterval, 'rightInterval')
        }, MOVEMENT_DELAY)
        state.current = directionIntervals.rightInterval
    }

    const handleUPMovement = () => {
        directionIntervals.upInterval = setInterval(() => {
            movePlayer({x: movePoints.x, y: movePoints.y--}, directionIntervals.upInterval, 'upInterval')
        }, MOVEMENT_DELAY)
        state.current = directionIntervals.upInterval
    }

    const handleLeftMovement = () => {
        directionIntervals.leftInterval = setInterval(() => {
            movePlayer({x: movePoints.x--, y: movePoints.y}, directionIntervals.leftInterval, 'leftInterval')
        }, MOVEMENT_DELAY)
        state.current = directionIntervals.leftInterval
    }

    const movePlayer = (position, intervale, key) => {
        const obstacleHit = checkObstacleCollision(position)
        movementPositions[key] = position;
        if (obstacleHit) {
            const findPrev = Object.values(directionIntervals).findIndex((prev) => prev === state.previous);
            const keys = Object.keys(directionIntervals)[findPrev];

            if (keys) {
                clearInterval(intervale);
                const movement = movementPositions[keys];
                directionIntervals[keys] = setInterval(() => {
                    const mov = movementRule(keys, movement);
                    const obstacleHit = checkObstacleCollision(position)

                    if (obstacleHit) {
                        movePoints.x = mov?.x
                        movePoints.y = mov?.y
                        movePlayer(mov, directionIntervals[keys], keys);
                    }
                }, MOVEMENT_DELAY)
                state.current = directionIntervals[keys]
            }
        }


        if (playerRef.current && !obstacleHit) {
            playerRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
        }

        if (playerRef.current &&
            boundary.current &&
            useBoundaryDetection.findNearBoundary(playerRef.current, boundary.current)) {
            clearInterval(intervale);
        }
    }
    const movementRule = (direction: string, position) => {
        if (direction === 'downInterval') {
            return {x: position.x, y: position.y++}
        }
        if (direction === 'rightInterval') {
            return {x: position.x++, y: position.y}
        }
        if (direction === 'upInterval') {
            return {x: position.x, y: position.y--}
        }
        if (direction === 'leftInterval') {
            return {x: position.x--, y: position.y}
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, []);

    useEffect(() => {
        boundary.current = boundaries;
        obstacleRef.current = obstacles;
        stoneState.current = dots
    }, [boundaries, obstacles, dots]);

    return <div ref={playerRef}
                className="w-[20px] h-[20px] bg-amber-400 rounded-full absolute
                left-[5px] top-[0px]
                            before:content-[''] before:absolute before:w-[3px] before:h-[3px]
                            before:bg-black before:rounded-full before:top-[7px] before:left-[5px]
                            after:content-[''] after:absolute after:w-[3px] after:h-[3px]
                            after:bg-black after:rounded-full after:top-[7px] after:right-[5px]">
    </div>
})
export default Player