import {useEffect, useRef} from "react";
import {KeyDownEnum} from "../enums/keyDown-enum.ts";
import {useObstacles} from "../State/store.ts";
import UseBoundaryDetection from "../Hooks/useBoundaryDetection.ts";

export default function Player() {

    const playerRef = useRef(null);
    const boundary = useRef(null);
    const useBoundaryDetection = UseBoundaryDetection()
    const {boundaries, obstacles} = useObstacles();

    const movePoints = {x: 5, y: 20};
    const MOVEMENT_DELAY = 20;

    const directionIntervals = {
        downInterval: null,
        upInterval: null,
        leftInterval: null,
        rightInterval: null,
    }

    const handleKeyDown = ((event) => {
        //remove intervals before starting new key press
        Object.values(directionIntervals).filter(id => id && id > 0).forEach(clearInterval);

        if (event.key === KeyDownEnum.DOWN) handleDownMovement();
        if (event.key === KeyDownEnum.UP) handleUPMovement();
        if (event.key === KeyDownEnum.LEFT) handleLeftMovement();
        if (event.key === KeyDownEnum.RIGHT) handleRightMovement();
    });

    const handleDownMovement = () => {
        directionIntervals.downInterval = setInterval(() => {
            movePlayer({x: movePoints.x, y: movePoints.y++}, directionIntervals.downInterval)
        }, MOVEMENT_DELAY)
    }

    const handleRightMovement = () => {
        directionIntervals.rightInterval = setInterval(() => {
            movePlayer({x: movePoints.x++, y: movePoints.y}, directionIntervals.rightInterval)
        }, MOVEMENT_DELAY)
    }
    const handleUPMovement = () => {
        directionIntervals.upInterval = setInterval(() => {
            movePlayer({x: movePoints.x, y: movePoints.y--}, directionIntervals.upInterval)
        }, MOVEMENT_DELAY)
    }

    const handleLeftMovement = () => {
        directionIntervals.leftInterval = setInterval(() => {
            movePlayer({x: movePoints.x--, y: movePoints.y}, directionIntervals.leftInterval)
        }, MOVEMENT_DELAY)
    }

    const movePlayer = (position, intervale) => {
        if (playerRef.current) playerRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
        if (useBoundaryDetection.findNearBoundary(playerRef.current, boundary.current)) clearInterval(intervale)
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, []);

    useEffect(() => {
        boundary.current = boundaries
    }, [boundaries, obstacles]);


    return <div ref={playerRef}
                className="w-[20px] h-[20px] bg-amber-400 rounded-full relative
                            before:content-[''] before:absolute before:w-[3px] before:h-[3px]
                            before:bg-black before:rounded-full before:top-[7px] before:left-[5px]
                            after:content-[''] after:absolute after:w-[3px] after:h-[3px]
                            after:bg-black after:rounded-full after:top-[7px] after:right-[5px]">
    </div>
}