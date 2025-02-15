import type { BuiltInData, Config, Data, FieldDefinition, FullConfig, State } from "./config";

import gameStorage from "./storage";
import dailyInit, { Result } from "./daily";
import initDark, { SYSTEM } from "./dark";
import initTodayNext from "./today-next";
import initStreakStats from "./streak-stats";
import initPuzzleSelector from "./puzzle-selector";

export { default as initStack } from "./state-stack";
export { el } from "./dom";

/** the definitions for the built-in data given a particular state type */
type BuiltInFieldData<T extends State> = FieldDefinition<BuiltInData<T>>;

/** the built-in fields we need to store to make things work */
const builtInFields: BuiltInFieldData<State> = {
	streak: { defaultValue: 0 },
	nextPuzzle: { defaultValue: 0 },
	bestStreak: { defaultValue: 0 },
	results: {
		defaultValue: {},
		exportTransform(object) {
			const keys = Object.keys(object).map(parseFloat);
			const max = Math.max(...keys);
			const array = [];
			for (let i = 1; i <= max; ++i)
				array[i - 1] = object[i] ?? 0;
			return array.join('');
		},
		importTransform(string) {
			const val: Record<number, Result> = {};
			for (let i = 0; i < string.length; ++i)
				val[i + 1] = parseInt(string[i]) as Result;
			return val;
		}
	},
	savedState: {
		defaultValue: { puzzleId: -1 },
		exclude: true
	},
	dark: { defaultValue: SYSTEM },
	reducedMotion: { defaultValue: SYSTEM },
};

/** the tools you need to run your game, returned by the main initialisation function */
export type DailyGameKit<DataType extends Data, StateType extends State> = ReturnType<typeof dailyGameKit<DataType, StateType>>;

/** initialises daily-game-kit */
export default function dailyGameKit<DataType extends Data, StateType extends State>(
	/** the config for your game */
	_config: Config<DataType>
) {

	const config: FullConfig<DataType, StateType> = {
		..._config,
		storedFields: {
			..._config.storedFields,
			...builtInFields,
		} as FieldDefinition<DataType & BuiltInData<StateType>>,
	};

	const storageModule = gameStorage(config);
	const daily = dailyInit(config, storageModule.storage);

	initDark(storageModule.storage);
	initTodayNext(daily);
	initStreakStats(storageModule.storage, daily);
	initPuzzleSelector(storageModule.storage, daily);

	return { ...storageModule, daily };
}
