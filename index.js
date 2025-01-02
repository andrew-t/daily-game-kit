import gameStorage from "./storage.js";
import dailyInit from "./daily.js";
import initDark, { SYSTEM } from "./dark.js";
import initTodayNext from "./today-next.js";
import initStreakStats from "./streak-stats.js";
import initPuzzleSelector from "./puzzle-selector.js";

/*
Config has:
	name: the name of your game
	namespace: the key to store data under
	defaults: default values for stored fields; only fields mentioned here can be stored
	exportTransforms: serialisers for the stored fields
	importTransforms: deserialisers for the stored fields
	except: stored fields that are not exported
	launchDate: the date of puzzle one in 2024-12-31 format
	skipDates: an array of dates in the same format for which no puzzle exists

All fields are required
*/

export default function dailyGameKit(config) {

	Object.assign(config.defaults, {
		streak: 0,
		nextPuzzle: 0,
		bestStreak: 0,
		results: {},
		savedState: { puzzleId: -1 },
		dark: SYSTEM,
		reducedMotion: SYSTEM,
	});

	config.except.push("savedState");

	config.exportTransforms.results = object => {
		const keys = Object.keys(object).map(parseFloat);
		const max = Math.max(...keys);
		const array = [];
		for (let i = 1; i <= max; ++i)
			array[i - 1] = object[i] ?? 0;
		return array.join('');
	};

	config.importTransforms.results = string => {
		const val = {};
		for (let i = 0; i < string.length; ++i)
			val[i + 1] = parseInt(string[i]);
		return val;
	};

	const storageModule = gameStorage(config);
	const daily = dailyInit(config, storageModule.storage);

	initDark(storageModule.storage);
	initTodayNext(daily);
	initStreakStats(storageModule.storage, daily);
	initPuzzleSelector(storageModule.storage, daily);

	return { ...storageModule, daily };
}
