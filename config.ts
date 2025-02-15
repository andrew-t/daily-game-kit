import type { SYSTEM } from "./dark";
import type { Result } from "./daily";

/** the data we're going to keep in your users' storage */
export type Data = { [key: string]: unknown };

/** the internal game state */
export type State = { puzzleId: number };

/** the data we store in your users' storage to make things work */
export interface BuiltInData<StateType extends State> {
	streak: number,
	nextPuzzle: number,
	bestStreak: number,
	results: Record<number, Result>,
	savedState: StateType & State,
	dark: typeof SYSTEM,
	reducedMotion: typeof SYSTEM,
}

/** a definition for a field to be stored in your users' storage */
export interface DataRecord<T> {
	/** what value this field takes if nothing is in storage */
	defaultValue: T;
	/** how we serialise the field for data transfer (if different from the default) */
	exportTransform?: (value: T) => string;
	/** how we deserialise the field for data transfer (if different from the default) */
	importTransform?: (value: string) => T;
	/** set this to true if you don't want to serialise this field for data transfer at all */
	exclude?: boolean;
}

/** information about what fields we're going to store inyour users' storage */
export type FieldDefinition<T> = {
	[key in keyof T]: DataRecord<T[key]>
}

/** all the information daily-game-kit needs to set up your environment */
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

/** the user-supplied config combined with the in-built config */
export type FullConfig<DataShape extends Data, StateType extends State> = Config<DataShape & BuiltInData<StateType>>;
