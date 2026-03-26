import EnemiesSvg from "../UI/EnemiesSvg.tsx";
import {forwardRef, memo, useEffect, useImperativeHandle, useRef} from "react";

export type ReduceState = {
    isWin: boolean;
    message: string;
};

export type StateProps = {
    reduceState: ReduceState;
    setWinner?: (isWin: boolean) => void
};


const Enemies = memo(forwardRef<SVGSVGElement, StateProps>(({reduceState}, forwardedRef) => {
    console.log("ref", forwardedRef)

// 1. Create a local ref that we KNOW is an object
    const localRef = useRef<SVGSVGElement>(null);

    // 2. Sync the localRef with the forwardedRef from the parent
    useImperativeHandle(forwardedRef, () => localRef.current!);

    const initialPosition = {x: 50, y: 70};

    const movementRule = (direction: string, position: { x: number, y: number }) => {
        if (direction === 'downInterval' && position.y + 1 <= 250) return {x: position.x, y: position.y + 1};
        if (direction === 'rightInterval' && position.x + 1 <= 760) return {x: position.x + 1, y: position.y};
        if (direction === 'upInterval' && position.y - 1 > 0) return {x: position.x, y: position.y - 1};
        if (direction === 'leftInterval' && position.x - 1 > 0) return {x: position.x - 1, y: position.y};
        return null;
    };

    const directionIntervals = ['downInterval', 'upInterval', 'leftInterval', 'rightInterval'];

    useEffect(() => {
        let position = {...initialPosition};
        let randomDirectionIndex = 0;

        //  logic to change direction every 2 seconds
        const dirInt = setInterval(() => {
            randomDirectionIndex = Math.floor(Math.random() * 4);
        }, 4000);

        // logic to move the enemy
        const moveEnemies = setInterval(() => {

            const currentDir = directionIntervals[randomDirectionIndex];
            const nextPos = movementRule(currentDir, position);

            if (nextPos) {
                position = nextPos;
                if (localRef.current) {
                    // debugger
                    localRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
                }
            } else {
                randomDirectionIndex = Math.floor(Math.random() * 4);
            }
        }, 10);
        const clearIntervals = () => {
            clearInterval(dirInt);
            clearInterval(moveEnemies);
        }

        if (reduceState.message.length) clearIntervals()

        return () => {
            clearIntervals()
        };
    }, [reduceState]);

    return <EnemiesSvg ref={localRef}/>;
}));

export default Enemies;