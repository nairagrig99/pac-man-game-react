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

export function collisionDetector(position: PositionType, element) {
    const PLAYER_SIZE = 20;
    const threshold = 1;
    return element.current.some((obs) => {
        return (
            position.x + threshold < obs.right &&
            position.x + PLAYER_SIZE - threshold > obs.x &&
            position.y + threshold < obs.bottom &&
            position.y + PLAYER_SIZE - threshold > obs.y
        );
    });
}

export function positionsDetector(elements) {
    return elements.map(obs => {
        const r = clientRect()(obs.element);
        return {
            x: obs.x,
            y: obs.y,
            right: obs.x + r.width - 20,
            bottom: obs.y + r.height
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