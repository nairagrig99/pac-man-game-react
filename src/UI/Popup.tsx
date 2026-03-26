import Button from "./Button.tsx";
import {createPortal} from "react-dom";

export type WinnerStatus = {
    status: string,
    isOpen: boolean,
    onClose: () => void
}
export default function Popup({isOpen, status, onClose}: WinnerStatus) {

    if (!isOpen) return null;

    return createPortal(
        <div className="popup absolute bg-white/70 w-full h-full">
            <div className="absolute top-1/2 left-1/2 w-[350px] h-[250px]
             bg-[#231414] -translate-x-1/2 -translate-y-1/2 text-center flex flex-col justify-center">
                <p className='text-white'>{status}</p>
                <Button value="Play Again"
                        onClick={onClose}
                        className="bg-gray-500 w-fit mx-auto my-2 px-[5px] py-[6px] rounded-[6px] text-white"/>
            </div>
        </div>,
        document.querySelector('#modal')
    )
}