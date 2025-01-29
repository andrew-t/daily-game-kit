import gameStorage from "./storage";
import dailyInit, { Result } from "./daily";
import initDark, { SYSTEM } from "./dark";
import initTodayNext from "./today-next";
import initStreakStats from "./streak-stats";
import initPuzzleSelector from "./puzzle-selector";
import type { BuiltInData, Config, Data, FieldDefinition, FullConfig, State } from "./config";

type BuiltInFieldData<T extends State> = FieldDefinition<BuiltInData<T>>;

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

export default function dailyGameKit<DataType extends Data, StateType extends State>(_config: Config<DataType>) {

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
