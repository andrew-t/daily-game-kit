import { initQuery } from "./query-string";
import getJson from "./json";
import type { BuiltInData, Config, Data, State } from "./config";

export const oneDay = 1000 * 60 * 60 * 24;

// these are numbers to keep data exports at a manageable size
export const UNPLAYED = 0;
export const PLAYED = 1;
export const COMPLETED = 2;
export const CHEATED = 3;
export const FAILED = 4;

export type Result = typeof UNPLAYED | typeof PLAYED | typeof COMPLETED | typeof CHEATED | typeof FAILED;

export type Daily = ReturnType<typeof dailyInit>;

export default function dailyInit({ launchDate, skipDates, allowFuturePuzzles }: Config<Data>, storage: BuiltInData<State>) {
    const epoch = parseDate(launchDate);
    const todaysPuzzleId = getTodaysPuzzleId();
    const puzzleId = initQuery.p ?? todaysPuzzleId.toString();
    const isTodaysPuzzle = puzzleId == todaysPuzzleId;

    async function loadPuzzle() {
        if (!/^\d+f?$/.test(puzzleId)) throw new Error("Invalid puzzle code");
        if ((/^\d+$/.test(puzzleId) || !allowFuturePuzzles) && parseInt(puzzleId, 10) > todaysPuzzleId)
            throw new Error("Puzzle not available yet");
        const strictId = parseInt(puzzleId);
        try {
            return await getJson(`puzzles/${strictId}.json`);
        } catch (e) {
            console.error(e);
            throw new Error("Unable to load puzzle data");
        }
    }

    function setResult(result: Result) {
        storage.results = {
            ...storage.results,
            [puzzleId]: result
        };
        if (isTodaysPuzzle) updateStreak(result);
    }

    function updateStreak(result: Result) {
        switch (result) {
            case COMPLETED:
                const intPId = parseInt(puzzleId, 10);
                if (storage.nextPuzzle == intPId)
                    storage.streak += 1;
                else if (intPId > storage.nextPuzzle)
                    storage.streak = 1;
                break;
            case CHEATED:
            case FAILED:
                storage.streak = 0;
                break;
            default: return; // no streak things happen unless the game ended
        }
        if (storage.streak > storage.bestStreak) storage.bestStreak = storage.streak;
        storage.nextPuzzle = todaysPuzzleId + 1;
    }

    function onStart() {
        if (!storage.results[puzzleId]) setResult(PLAYED);
    }
    function onCheat() {
        if (storage.results[puzzleId] !== COMPLETED) setResult(CHEATED);
    }
    function onWin() {
        if (storage.results[puzzleId] !== CHEATED) setResult(COMPLETED);
    }

    return { epoch, todaysPuzzleId, puzzleId, isTodaysPuzzle, loadPuzzle, onStart, onCheat, onWin };

    /** returns ms from 1970-01-01T00:00:00.000Z */
    function parseDate(dateString: string) {
        const parts = dateString.split('-').map(x => parseInt(x, 10));
        return Date.UTC(parts[0], parts[1] - 1, parts[2]);
    }

    function getTodaysPuzzleId() {
        // This is the basic time you'd expect if there were no skip dates
        let id = Math.floor((Date.now() - epoch) / oneDay + 1);
        // For every skip date that's today or earlier, we effectively go back one
        return id - skipDates.filter(dateIsTodayOrEarlier).length;
    }

    function dateIsTodayOrEarlier(dateString: string) {
        return parseDate(dateString) < Date.now();
    }
}
