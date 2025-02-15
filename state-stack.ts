import type { Data, State } from "./config";
import type { DailyGameKit } from "./index.js";

/** the state type you should use if you want to use an undo stack */
interface StackState<StackType> extends State {
    undoStack: StackType[];
    undoPointer: number;
}

/** a function to be called when something happens */
export type Listener<T> = (state: T) => void;

/** gives you an object to track game state changes on an undo stack */
export default async function initStack<DataType extends Data, StackType, PuzzleType>(
    { storage, daily }: DailyGameKit<DataType, StackState<StackType>>,
    initialState: (puzzle: PuzzleType) => StackType
) {
    const { loadPuzzle, puzzleId, isTodaysPuzzle } = daily;

    class StateStack {
        undoStack: StackType[];
        undoPointer: number;
        listeners: Listener<StackType>[];

        constructor(state: StackType) {
            this.undoStack = [state];
            this.undoPointer = 0;
            this.listeners = [];
        }

        /** Add a function to call when something changes */
        onUpdate(callback: Listener<StackType>): void {
            this.listeners.push(callback);
        }

        /** Call all the listeners */
        emitUpdate(): void {
            if (isTodaysPuzzle)
                storage.savedState = {
                    puzzleId,
                    undoStack: this.undoStack,
                    undoPointer: this.undoPointer
                };
            for (const callback of this.listeners) callback(this.current());
        }

        /** get the current state - this is a deep clone so you can do what you want with it */
        current(): StackType {
            return deepClone(this.undoStack[this.undoPointer]);
        }

        /** updates the state, pushing a new entry onto the stack */
        push(
            /** a reducer-style function that takes the current state and modifies it */
            callback: (state: StackType) => StackType
        ): void {
            const current = this.current();
            const next = callback(current);
            if (!next) return;
            ++this.undoPointer;
            this.undoStack.splice(this.undoPointer, Infinity);
            this.undoStack.push(next);
            this.emitUpdate();
        }

        /** moves to the previous state (if there is one) */
        undo(): boolean {
            if (this.undoPointer <= 0) return false;
            --this.undoPointer;
            this.emitUpdate();
            return true;
        }

        /** moves to the next state (if there is one) */
        redo(): boolean {
            if (this.undoPointer >= this.undoStack.length - 1) return false;
            ++this.undoPointer;
            this.emitUpdate();
            return true;
        }
    }

    const puzzle = await loadPuzzle();
    const state = new StateStack(initialState(puzzle));
    if (storage.savedState.puzzleId == puzzleId) {
        state.undoPointer = storage.savedState.undoPointer;
        state.undoStack = storage.savedState.undoStack;
    }
    return state;
}

function deepClone<T>(a: T) {
    if (Array.isArray(a)) return a.map(deepClone);
    if (a && typeof a == 'object') return Object.fromEntries(deepClone(Object.entries(a)));
    return a;
}
