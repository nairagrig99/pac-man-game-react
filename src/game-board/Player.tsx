import {forwardRef, useEffect, useRef} from "react";
import {KeyDownEnum} from "../enums/keyDown-enum.ts";
import {useObstacles} from "../State/store.ts";
import type {PositionType} from "./GameBoard.tsx";
import {memo} from 'react';
import {boundaryDetection, collisionDetector, collisionDotDetector, positionsDetector} from "../Utils/utils.ts";
import type {StateProps} from "./Enemies.tsx";

const Player = memo(forwardRef<HTMLDivElement, StateProps>(function Player({reduceState, setWinner}, playerRef) {

    const boundary = useRef<HTMLDivElement>(null);
    const obstacleRef = useRef<PositionType[]>([]);
    const stoneState = useRef<PositionType[]>([]);
    const {boundaries, obstacles, dots} = useObstacles();
    const movePoints: PositionType = {x: 5, y: 10};
    const MOVEMENT_DELAY: number = 10;

    const directionIntervals = useRef({
        downInterval: 0,
        upInterval: 0,
        leftInterval: 0,
        rightInterval: 0,
    })

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

    const obstacleBounds = useRef([]);
    const stoneBounds = useRef([]);

    useEffect(() => {
        obstacleBounds.current = positionsDetector(obstacles)
        stoneBounds.current = positionsDetector(dots)
    }, [obstacles, dots]);


    const handleKeyDown = ((event) => {
        state.previous = state.current;
        Object.values(directionIntervals.current).forEach((interval) => clearInterval(interval));

        if (event.key === KeyDownEnum.DOWN) handleDownMovement();
        if (event.key === KeyDownEnum.UP) handleUPMovement();
        if (event.key === KeyDownEnum.LEFT) handleLeftMovement();
        if (event.key === KeyDownEnum.RIGHT) handleRightMovement();
    });

    const handleDownMovement = () => {
        directionIntervals.current.downInterval = setInterval(() => {
            movePlayer(movementRule('downInterval', movePoints), directionIntervals.current.downInterval, 'downInterval')
        }, MOVEMENT_DELAY)
        state.current = directionIntervals.current.downInterval
    }

    const handleRightMovement = () => {
        directionIntervals.current.rightInterval = setInterval(() => {
            movePlayer(movementRule('rightInterval', movePoints), directionIntervals.current.rightInterval, 'rightInterval')
        }, MOVEMENT_DELAY)
        state.current = directionIntervals.current.rightInterval
    }

    const handleUPMovement = () => {
        directionIntervals.current.upInterval = setInterval(() => {
            movePlayer(movementRule('upInterval', movePoints), directionIntervals.current.upInterval, 'upInterval')
        }, MOVEMENT_DELAY)
        state.current = directionIntervals.current.upInterval
    }

    const handleLeftMovement = () => {
        directionIntervals.current.leftInterval = setInterval(() => {
            movePlayer(movementRule('leftInterval', movePoints), directionIntervals.current.leftInterval, 'leftInterval')
        }, MOVEMENT_DELAY)
        state.current = directionIntervals.current.leftInterval
    }

    const movePlayer = (position, intervale, key: string) => {
        if (!key.length) clearInterval(intervale);
        // collision for find obstacles when player hit them
        const obstacleHit = collisionDetector(position, obstacleBounds, (isHit) => {
            if (isHit) {
                clearInterval(intervale);
            }
        });

        movementPositions[key] = position;
        if (obstacleHit) {
            const findPrev = Object.values(directionIntervals.current).findIndex((prev) => prev === state.previous);
            const keys = Object.keys(directionIntervals.current)[findPrev];

            if (keys) {
                clearInterval(intervale);
                const movement = movementPositions[keys];
                directionIntervals.current[keys] = setInterval(() => {
                    const mov = movementRule(keys, movement);
                    movePoints.x = mov?.x
                    movePoints.y = mov?.y
                    movePlayer(mov, directionIntervals.current[keys], keys);
                }, MOVEMENT_DELAY)
                state.current = directionIntervals.current[keys]
            }
        }

        if (playerRef.current && !obstacleHit) {
            playerRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
        }

        if (playerRef.current &&
            boundary.current &&
            boundaryDetection(playerRef.current, boundary.current) || obstacleHit) {
            clearInterval(intervale);
        }

        // collision for find dots when player hit them
        const dotsHitIndex = collisionDotDetector(position, stoneBounds);

        if (dotsHitIndex >= 0) {
            const dots = Array.from(document.querySelectorAll('.dots'));

            if (dots[dotsHitIndex] && stoneBounds.current[dotsHitIndex]) {
                dots[dotsHitIndex].remove();
                stoneBounds.current.splice(dotsHitIndex, 1)
            }
        }
        console.log("stoneBounds.current.length", stoneBounds.current.length)
        if (stoneBounds.current.length <= 3) setWinner(true)
    }

    const stopAllMovement = () => {
        Object.values(directionIntervals.current).forEach((interval) => {
            if (interval) clearInterval(interval);
        });
        directionIntervals.current = {
            downInterval: 0,
            upInterval: 0,
            leftInterval: 0,
            rightInterval: 0,
        };

    };

    useEffect(() => {
        if (reduceState.message.length) stopAllMovement()
    }, [reduceState]);


    const movementRule = (direction: string, position: PositionType) => {
        if (direction === 'downInterval') return {x: position.x, y: position.y++}
        if (direction === 'rightInterval') return {x: position.x++, y: position.y}
        if (direction === 'upInterval') return {x: position.x, y: position.y--}
        if (direction === 'leftInterval') return {x: position.x--, y: position.y}
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

    return <>
        <div ref={playerRef}
             className="w-[20px] h-[20px] bg-amber-400 rounded-full absolute
             player
                left-[5px] top-[0px]
                            before:content-[''] before:absolute before:w-[3px] before:h-[3px]
                            before:bg-black before:rounded-full before:top-[7px] before:left-[5px]
                            after:content-[''] after:absolute after:w-[3px] after:h-[3px]
                            after:bg-black after:rounded-full after:top-[7px] after:right-[5px]">
        </div>
    </>

}))
export default Player