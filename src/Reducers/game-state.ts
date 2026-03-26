import type {ReduceState} from "../game-board/Enemies.tsx";

export const initialReduceState: ReduceState = {
    isWin: false,
    message: "",
};

export function gameStateReducer(state = initialReduceState, action) {
    switch (action.type) {
        case 'GAME_OVER':
            return {...state, isWin: false, message: 'GAME OVER'}
        case 'WIN_GAME':
            return {...state, isWin: true, message: 'Congratulation you Winner'}
        case 'PLAY_AGAIN':
            alert("PLAY AGAIN")
            return {...state, isWin: false, message: ''}
        case 'CLOSE':
            return {...state, isWin: false, message: ''}
    }
}