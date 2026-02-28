export default function UseBoundaryDetection() {

    const findNearBoundary = (element: HTMLDivElement, boundary: HTMLDivElement) => {
        if (!boundary) return
        const rect = element.getBoundingClientRect();
        const boundaryRect = boundary.getBoundingClientRect();
        const nearPosition = 1;
        const near = {
            top: rect.top - boundaryRect.top < nearPosition,
            bottom: Math.abs(rect.bottom - boundaryRect.bottom) < nearPosition,
            left: rect.left - boundaryRect.left < nearPosition,
            right: Math.abs(rect.right - boundaryRect.right) < nearPosition,
        }
        return Object.values(near).some((isEqual) => isEqual);
    }

    return {findNearBoundary}
}