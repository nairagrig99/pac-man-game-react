export default function useClientRect() {
    return function (element: HTMLDivElement) {
        return element.getBoundingClientRect()
    }
}