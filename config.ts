import type { SYSTEM } from "./dark";
import type { Result } from "./daily";

export interface DataRecord<T> {
	defaultValue: T;
	exportTransform?: (value: T) => string;
	importTransform?: (value: string) => T;
	exclude?: boolean;
}

export type Data = { [key: string]: unknown };
export type State = { puzzleId: number };

export interface BuiltInData<StateType extends State> {
	streak: number,
	nextPuzzle: number,
	bestStreak: number,
	results: Record<number, Result>,
	savedState: Partial<StateType> & State,
	dark: typeof SYSTEM,
	reducedMotion: typeof SYSTEM,
}

export type FieldDefinition<T> = {
	[key in keyof T]: DataRecord<T[key]>
}

export interface Config<T extends Data> {
	/** the name of your game */
	name: string,
	/** the key to store data under */
	namespace: string,
	/** stored fields; only fields mentioned here can be stored */
	storedFields: FieldDefinition<T>,
	/** the date of puzzle one in 2024-12-31 format */
	launchDate: string,
	/** an array of dates in the same format for which no puzzle exists */
	skipDates: string[],
	/** if true, you can access future puzzles using ?p=12f rather than ?p=12 */
	allowFuturePuzzles: boolean,
}

export type FullConfig<DataShape extends Data, StateType extends State> = Config<DataShape & BuiltInData<StateType>>;
