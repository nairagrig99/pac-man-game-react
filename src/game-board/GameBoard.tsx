import {StyleEnum} from "../constants/style-enum.ts";
import {useEffect, useRef, useState} from "react";

type PositionType = {
    x: number,
    y: number,
    element?: HTMLDivElement
}
export default function GameBoard() {
    const classes = StyleEnum;

    const boardRef = useRef<HTMLDivElement>(null);
    const boxBoundaryRef = useRef<HTMLDivElement>(null);
    const obstacleBlock = useRef<HTMLDivElement[]>([]);
    const [obstacleState, setObstacleState] = useState<PositionType[]>();
    const [styles, setStyles] = useState<{ width: string; left: string }[]>([]);
    const stoneState: PositionType[] = [];
    const horizontalStartPoint = 0;
    const startingPoint = {x: horizontalStartPoint, y: 20};
    const movePoint = {x: 20, y: 20};
    // change to Map to Set
    const gap = 40;

    const setObstaclesStyles = () => {
        if (boxBoundaryRef.current && obstacleBlock.current.length) {
            const boardRect = boxBoundaryRef.current.getBoundingClientRect();
            const obstacleCount = 3;
            const width = ((boardRect.width - (gap * 4)) / obstacleCount);
            const newStyles = obstacleBlock.current.map((_, index) => {
                const moveLeft = gap * (index + 1) + width * index;
                return {
                    width: `${width}px`,
                    left: `${moveLeft}px`
                };

            });
            console.log("newStyles", newStyles)
            setStyles(newStyles);
        }
    }

    function findObstacle() {
        console.log("hereeeeee")

        const elem = obstacleBlock.current.map((element) => {
            const elRect = element.getBoundingClientRect();

            const parentRect = boardRef.current.getBoundingClientRect();

            const visualX = Math.floor(elRect.left - parentRect.left);
            const visualY = Math.floor(elRect.top - parentRect.top);

            return {
                x: visualX,
                y: visualY,
                element
            }
        })
        console.log("elem", elem)
        setObstacleState(elem);
    }

    useEffect(() => {
        if (styles.length && obstacleBlock.current.length) findObstacle()
    }, [styles]);

    useEffect(() => {
        if (obstacleBlock.current.length) {
            setObstaclesStyles()
        }
    }, []);

    useEffect(() => {
        if (obstacleState?.length) {

            const boardWidth = Math.floor(boxBoundaryRef.current.getBoundingClientRect().width);
            const boardHeight = Math.floor(boxBoundaryRef.current.getBoundingClientRect().height);
            const divisionWidth = boardWidth / 2;
            const halfOfTheBoard = divisionWidth / 10;

            const boardHeightDivision = boardHeight / 20;

            let ind = 0;
            const obstacle = obstacleState[ind];

            console.log("obstacle", obstacle)
            const obstacleRect = obstacle.element.getBoundingClientRect();

            const width = Math.floor(obstacleRect.width);
            const endPoint = width + obstacle.x + movePoint.x
            let startPointIsSet = false;
            for (let i = 1; i < boardHeightDivision; i++) {
                second: for (let j = 0; j < halfOfTheBoard; j++) {
                    const dot = document.createElement('p');
                    dot.classList.add('w-[5px]', 'h-[5px]', 'bg-red-500', 'absolute', 'top-0', 'left-0');

                    dot.style.top = ` ${startingPoint.y}px`;
                    dot.style.left = ` ${startingPoint.x}px`;

                    startingPoint.x += movePoint.x;

                    const xPos = obstacle.x >= startingPoint.x;
                    const yPos = obstacle.y >= startingPoint.y;

                    if (xPos && yPos) {
                        startPointIsSet = true;
                        boxBoundaryRef.current?.appendChild(dot);
                    }

                    // console.log(" Math.abs(startingPoint.x - endPoint", Math.abs(startingPoint.x - endPoint));

                    const isEqual = Math.abs(startingPoint.x - endPoint) <= 10;

                    // console.log("obstacle.x", obstacle.x)
                    if (startPointIsSet && startingPoint.x <= endPoint) {
                        continue second
                    } else {
                        startPointIsSet = false;
                        // console.log("startPointIsSet");
                    }

                    boxBoundaryRef.current?.appendChild(dot);
                    stoneState.push({x: startingPoint.x, y: startingPoint.y, element: dot})
                    if (isEqual) {
                        // console.log("isEqual", isEqual)
                        ind++;
                        console.log("obstacle", ind)
                    }
                    console.log("obstacleobstacle", ind)
                }
                startingPoint.y += movePoint.y
                startingPoint.x = horizontalStartPoint
            }
        }
    }, [obstacleState]);


    return <div ref={boxBoundaryRef}
                className="w-[800px] mx-auto h-[300px] border absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div ref={boardRef} className="relative">
            {[...Array(1)].map((_, index) => (
                [...Array(3)].map((_, ind) => (
                    <div
                        key={`${index}-${ind}`}
                        style={styles[ind]}
                        ref={el => {
                            if (el) obstacleBlock.current[ind] = el;
                        }}
                        className={index == 1
                            ? `${classes.SECOND_LINE_OBSTACLE}`
                            : `${classes.OBSTACLE_CLASS} absolute top-[20px]`
                        }>
                        {index == 1 && <div className={classes.LINE}></div>}
                    </div>
                ))
            ))}
        </div>
    </div>
}