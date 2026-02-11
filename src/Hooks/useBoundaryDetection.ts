export default function UseBoundaryDetection() {

    const findNearBoundary = (element: HTMLDivElement, boundary: HTMLDivElement) => {
        if (!boundary) return
        const rect = element.getBoundingClientRect();
        const boundaryRect = boundary.getBoundingClientRect();

        const near = {
            top: rect.top - boundaryRect.top < 10,
            bottom: Math.abs(rect.bottom - boundaryRect.bottom) < 10,
            left: rect.left - boundaryRect.left < 5,
            right: Math.abs(rect.right - boundaryRect.right) < 5,
        }
        return Object.values(near).some((isEqual) => isEqual);
    }

    return {findNearBoundary}
}