import EnemiesSvg from "../UI/EnemiesSvg.tsx";
import {forwardRef, memo, useEffect, useImperativeHandle, useRef} from "react";
import type {StateProps} from "../Model/StatePropsType.ts";
import {MoveDirection} from "../enums/keyDown-enum.ts";

const Enemies = memo(forwardRef<SVGSVGElement, StateProps>(({reduceState}, forwardedRef) => {

    const localRef = useRef<SVGSVGElement>(null);

    useImperativeHandle(forwardedRef, () => localRef.current!);

    const initialPosition = {x: 50, y: 70};

    const movementRule = (direction: string, position: { x: number, y: number }) => {
        if (direction === MoveDirection.DOWN && position.y + 1 <= 250) return {x: position.x, y: position.y + 1};
        if (direction === MoveDirection.RIGHT && position.x + 1 <= 700) return {x: position.x + 1, y: position.y};
        if (direction === MoveDirection.UP && position.y - 1 > 0) return {x: position.x, y: position.y - 1};
        if (direction === MoveDirection.LEFT && position.x - 1 > 0) return {x: position.x - 1, y: position.y};
        return null;
    };

    const directionIntervals = [...Object.values(MoveDirection)];

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