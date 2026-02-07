import {StyleEnum} from "../constants/style-enum.ts";
import {useEffect, useRef, useState} from "react";
import useStyle from "../Hooks/use-style.ts";
import useFindObstacle from "../Hooks/useFindObstacle.ts";
import Player from "./Player.tsx";

type PositionType = {
    x: number,
    y: number,
    element?: HTMLDivElement
}
export default function GameBoard() {
    const classes = StyleEnum;

    const boardRef = useRef<HTMLDivElement>(null);
    const boxBoundaryRef = useRef<HTMLDivElement>(null);

    const obstacleRef = useRef<HTMLDivElement[][]>([]);
    const innerObstacleRef = useRef<HTMLDivElement[][]>([]);

    const [obstacleState, setObstacleState] = useState<PositionType[]>();

    // custom hook for setting styles
    const obstacleStyle = useStyle();
    //custom hook for finding obstacles
    const useFind = useFindObstacle();

    const stoneState: PositionType[] = [];


    const horizontalStartPoint = 10;
    const startingPoint = {x: horizontalStartPoint, y: 20};
    const movePoint = {x: 20, y: 20};


    useEffect(() => {
        if (obstacleStyle.styles.length && obstacleRef.current.length) {
            const findObstacle = useFind.findObstacle(obstacleRef, boardRef);
            setObstacleState(findObstacle);
        }
    }, [obstacleStyle.styles]);

    useEffect(() => {
        if (obstacleRef.current.length) {
            obstacleStyle.setObstacleStyles(boxBoundaryRef, obstacleRef)
        }
    }, []);


    useEffect(() => {
        if (obstacleState?.length && boxBoundaryRef.current) {
            const box = boxBoundaryRef.current.getBoundingClientRect();

            const boardWidth = Math.floor(box.width);
            const boardHeight = Math.floor(box.height);

            const divisionWidth = boardWidth / 2;
            const halfOfTheBoard = divisionWidth / 10;
            const boardHeightDivision = boardHeight / 20;

            let startIndex = 0;
            let endIndex = 3;
            let ind = startIndex;

            let obstacle = obstacleState[ind];
            let obstacleCount = [];
            const obstacleRect = obstacle.element.getBoundingClientRect();
            const obstacleExist = [];

            let width = Math.floor(obstacleRect.width);
            let height = Math.floor(obstacleRect.height);

            let endPoint = width + obstacle.x + movePoint.x;
            let heightPosition = obstacle.y + height;

            const NEAR_DISTANCE = 10;
            let startPointIsSet = false;
            let isFindObstacle = false;

            let innerIndex = 0;
            let innerObstacle = innerObstacleRef.current.flat()[innerIndex];
            let rect = innerObstacle.getBoundingClientRect();
            let topRelative = Math.floor(rect.top - box.top);
            let leftRelative = Math.floor(rect.left - box.left);
            let bottomRelative = Math.floor(rect.bottom - box.top);
            let innerObstacleEndPoint = rect.width + leftRelative + movePoint.x;


            const updateCurrentObstacle = (newIndex: number) => {
                ind = newIndex;
                obstacle = obstacleState[ind];

                const rect = obstacle?.element?.getBoundingClientRect();
                if (!rect) return;

                width = Math.floor(rect.width);
                height = Math.floor(rect.height);
                endPoint = obstacle.x + width; // top
                heightPosition = obstacle.y + height; // bottom edge
            };

            updateCurrentObstacle(ind)
            let shouldContinue = false;
            for (let i = 1; i < boardHeightDivision; i++) {

                second: for (let j = 0; j < halfOfTheBoard - 1; j++) {

                    const dot = document.createElement('p');
                    dot.classList.add('w-[5px]', 'h-[5px]', 'bg-red-500', 'absolute', 'top-0', 'left-0');

                    dot.style.top = ` ${startingPoint.y}px`;
                    dot.style.left = ` ${startingPoint.x}px`;

                    startingPoint.x += movePoint.x;

                    let bottom = Math.abs(bottomRelative - startingPoint.y) <= NEAR_DISTANCE
                    // let top = Math.abs(topRelative - startingPoint.y) <= NEAR_DISTANCE
                    let left = Math.abs(leftRelative - startingPoint.x) <= NEAR_DISTANCE

                    if (bottom  && left) {
                        shouldContinue = true
                        boxBoundaryRef.current?.appendChild(dot);
                        stoneState.push({x: startingPoint.x, y: startingPoint.y, element: dot});
                    }

                    if (shouldContinue && startingPoint.x > innerObstacleEndPoint) {
                        if (bottom) innerIndex++;
                        if (innerIndex < 3) {
                            innerObstacle = innerObstacleRef.current.flat()[innerIndex];
                            rect = innerObstacle.getBoundingClientRect();
                            topRelative = Math.floor(rect.top - box.top);
                            leftRelative = Math.floor(rect.left - box.left);
                            bottomRelative = Math.floor(rect.bottom - box.top);
                            innerObstacleEndPoint = rect.width + leftRelative + movePoint.x;
                            bottom = Math.abs(bottomRelative - startingPoint.y) <= NEAR_DISTANCE
                            // top = Math.abs(topRelative - startingPoint.y) <= NEAR_DISTANCE
                            left = Math.abs(leftRelative - startingPoint.x) <= NEAR_DISTANCE
                            shouldContinue = false
                        }
                    }

                    if (shouldContinue && startingPoint.x <= innerObstacleEndPoint) continue second
                    else shouldContinue = false


                    const xPos = Math.abs(obstacle.x - startingPoint.x) <= NEAR_DISTANCE;
                    const yPos = (Math.abs(obstacle.y - startingPoint.y) <= NEAR_DISTANCE && obstacle.y >= startingPoint.y) || obstacle.y === startingPoint.y;
                    const heightPos = Math.abs(heightPosition - startingPoint.y) <= NEAR_DISTANCE && xPos;

                    if ((xPos && yPos) || heightPos) {
                        startPointIsSet = true;
                        isFindObstacle = true;
                        boxBoundaryRef.current?.appendChild(dot);
                        stoneState.push({x: startingPoint.x, y: startingPoint.y, element: dot});
                    }

                    if ((startPointIsSet && startingPoint.x > endPoint) || heightPos) {
                        ind++;

                        if (ind < endIndex) {
                            obstacle = obstacleState[ind];
                            endPoint = width + obstacle.x + movePoint.x;
                            heightPosition = height + obstacle.y;
                        }

                        if (ind > endIndex) {
                            ind = startIndex
                            updateCurrentObstacle(ind)
                        }
                    }

                    if (!shouldContinue && bottom && top) {

                        innerIndex++
                        if (innerIndex < 3) {
                            innerObstacle = innerObstacleRef.current.flat()[innerIndex];
                            rect = innerObstacle.getBoundingClientRect();
                            topRelative = Math.floor(rect.top - box.top);
                        }
                    }
                    if (startPointIsSet && startingPoint.x < endPoint && i != boardHeightDivision - 1) continue second
                    else startPointIsSet = false;

                    boxBoundaryRef.current?.appendChild(dot);
                    stoneState.push({x: startingPoint.x, y: startingPoint.y, element: dot});
                }

                startingPoint.y += movePoint.y
                startingPoint.x = horizontalStartPoint;

                const isHeightReach = Math.abs(heightPosition - startingPoint.y) <= NEAR_DISTANCE
                const point = startingPoint.y >= obstacle.y - NEAR_DISTANCE && startingPoint.y <= heightPosition && height === 90;

                if (isHeightReach && !point) obstacleExist.push(obstacle);

                // check if every obstacle work more then twice
                const key = obstacle.y;
                obstacleCount = obstacleExist.reduce((acc) => {
                    if (!acc[key]) {
                        acc[key] = 1;
                    } else {
                        acc[key] += 1;
                    }
                    return acc
                }, {})

                const firstProperty = Object.values(obstacleCount)[0];

                if (firstProperty > 2 && !point) {
                    if (startIndex < endIndex && endIndex < obstacleState?.length - 1 && isFindObstacle) {
                        startIndex = endIndex;
                        endIndex += 3
                        isFindObstacle = false;
                    }
                    obstacleExist.length = 0;
                } else obstacleExist.push(obstacle)

                ind = startIndex
                updateCurrentObstacle(ind)
            }
            console.log('stoneState', stoneState)
        }


    }, [obstacleState]);


    return <div ref={boxBoundaryRef}
                className="w-[800px] mx-auto h-[300px] border absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div ref={boardRef} className="relative">
            {[...Array(3)].map((_, index) => (
                [...Array(3)].map((_, ind) => (
                    <div
                        key={`${index}-${ind}`}
                        style={obstacleStyle.styles[index]?.[ind]}
                        ref={el => {
                            if (!obstacleRef.current[index]) obstacleRef.current[index] = [];
                            if (el) obstacleRef.current[index][ind] = el;
                        }}
                        className={index == 1
                            ? `${classes.SECOND_LINE_OBSTACLE}`
                            : `${classes.OBSTACLE_CLASS} `
                        }>
                        {index == 1 &&
                            <div ref={innerElement => {
                                if (!innerObstacleRef.current[0] && innerElement) innerObstacleRef.current[0] = [];
                                if (innerElement) innerObstacleRef.current[0][ind] = innerElement;

                            }} className={classes.LINE}>

                            </div>}
                    </div>
                ))
            ))}

            <Player></Player>
        </div>
    </div>

}