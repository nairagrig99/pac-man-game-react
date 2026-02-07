import {useRef} from "react";

export default function Player() {

    const playerRef = useRef(null)

    const moveMent = () => {

    }


    return <div ref={playerRef} className="w-[20px] h-[20px] bg-amber-400 rounded-full relative
                            before:content-[''] before:absolute before:w-[3px] before:h-[3px]
                            before:bg-black before:rounded-full before:top-[7px] before:left-[5px]
                            after:content-[''] after:absolute after:w-[3px] after:h-[3px]
                            after:bg-black after:rounded-full after:top-[7px] after:right-[5px]">
    </div>
}