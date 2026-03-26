import type {ReduceState} from "./ReduceStateType.ts";

export type StateProps = {
    reduceState: ReduceState;
    setWinner?: (isWin: boolean) => void
};