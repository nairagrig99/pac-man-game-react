export default function useFindObstacle() {
    const findObstacle = (obstacleRef, boardRef) => {
        return obstacleRef.current.flat().map((element) => {

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
    }
    return {findObstacle}
}