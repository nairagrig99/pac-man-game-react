import type {PositionType} from "../game-board/GameBoard.tsx";

export function clientRect() {
    return function (element: HTMLDivElement) {
        return element.getBoundingClientRect()
    }
}

export function boundaryDetection(element: HTMLDivElement, boundary: HTMLDivElement) {
    if (!boundary) return
    const rect = clientRect()(element);
    const boundaryRect = clientRect()(boundary);

    const nearPosition = 1;
    const near = {
        top: rect.top - boundaryRect.top < nearPosition,
        bottom: Math.abs(rect.bottom - boundaryRect.bottom) < nearPosition,
        left: rect.left - boundaryRect.left < nearPosition,
        right: Math.abs(rect.right - boundaryRect.right) < nearPosition,
    }
    return Object.values(near).some((isEqual) => isEqual);
}


export function collisionDotDetector(position, element) {
    const PLAYER_SIZE = 20;

    return element.current.findIndex((obs) => {
        const playerCenterX = position.x + PLAYER_SIZE / 2;
        const playerCenterY = position.y + PLAYER_SIZE / 2;

        const dotCenterX = obs.x + (obs.right - obs.x) / 2;
        const dotCenterY = obs.y + (obs.bottom - obs.y) / 2;

        const distance = Math.hypot(
            playerCenterX - dotCenterX,
            playerCenterY - dotCenterY
        );

        return distance < 15;
    });
}

let isInside = false;
let isExit = false;
let obstacle = null

export function collisionDetector(position: PositionType, element,calback?) {
    const PLAYER_SIZE = 20;
    return element.current.some((obs) => {

        if (!isInside) {
            //check if player inside (enter) obstacle
            if (Math.abs(position.x - obs.right) <= 10
                && position.y < obs.bottom &&
                position.y + PLAYER_SIZE > obs.y
                && obs.element.classList.contains('second_line')) {
                obstacle = obs
                isInside = true

            } else {
                isInside = false
                return position.x < obs.right &&
                    position.x + PLAYER_SIZE > obs.x &&
                    position.y < obs.bottom &&
                    position.y + PLAYER_SIZE > obs.y
            }
        } else if (obstacle && isInside) {
            // check if player exit from obstacle , and it can exit only from right side
            if (position.x > obstacle.right) {
                console.log("EXIT")
                isInside = false
                isExit = true
                return false
            }

            //if player inside obstacle  then don't let exit from other parts 'top, bottom,left'
            if (!(position.y > obstacle.y
                && position.y < obstacle.bottom - 20
                && position.x > obstacle.x)
            ) {
                calback(true)
                isExit = false
                return false
            }
        }
    });
}

export function positionsDetector(elements) {
    return elements.map(obs => {
        const r = clientRect()(obs.element);
        return {
            x: obs.x,
            y: obs.y,
            right: obs.x + r.width - 20,
            bottom: obs.y + r.height,
            element: obs.element
        };
    });
}

export function findObstacleDetector(obstacleRef, boardRef) {
    return obstacleRef.current.flat().map((element) => {

        const elRect = clientRect()(element);

        const parentRect = clientRect()(boardRef.current);

        const visualX = Math.floor(elRect.left - parentRect.left);
        const visualY = Math.floor(elRect.top - parentRect.top);
        const endPoint = Math.floor(elRect.width + visualX);

        return {
            x: visualX,
            y: visualY,
            endPoint,
            element
        }
    })

}