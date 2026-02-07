import {useState} from "react";

export default function useStyle() {

    const [styles, setStyles] = useState<{ width: string; left: string }[][]>([]);
    const gap = 40;
    const setObstacleStyles = (boxBoundaryRef, obstacleRef) => {
        if (boxBoundaryRef && obstacleRef) {
            const boardRect = boxBoundaryRef.current.getBoundingClientRect();
            const obstacleCount = 3;

            const width = ((boardRect.width - (gap * 4)) / obstacleCount);
            let top = gap;
            const newStyles = obstacleRef.current.map((obs) => {
                return obs.map((innerObs, ind) => {
                    const height = innerObs.getBoundingClientRect().height
                    const moveLeft = gap * (ind + 1) + width * ind;

                    const style = {
                        width: `${width}px`,
                        left: `${moveLeft}px`,
                        top: `${top}px`
                    };

                    if (ind >= obs.length - 1) {
                        top += gap + height
                    }
                    return style
                })
            });
            setStyles(newStyles);
        }
    }
    return {styles, setObstacleStyles}


}