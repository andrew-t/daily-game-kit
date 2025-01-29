# daily-game-kit

If you've played my daily games, [Cell Tower](https://www.andrewt.net/puzzles/cell-tower), [Celtix](https://www.andrewt.net/puzzles/celtix), [Ronin](https://www.andrewt.net/puzzles/ronin) and [3Doku](https://www.andrewt.net/puzzles/3doku), you've probably noticed I re-use a lot of the systems between games. All of them feature streaks, a puzzle selector, savable settings, etc. When I first built Cell Tower I didn't create a whole library of tools to power it, but I did design its systems to be re-used. Now that I've released my fourth daily game, I thought it was time to finally pull all the reusable parts into a single library that I could use to build other games. And since I was doing that, why not let other people use it too?

This package gives you all the nuts and bolts of the daily game setup, including working out what day it is and loading the day's puzzle. It won't control anything else — you'll need to generate puzzles, build the player, call the functions, etc yourself.

# How to use

Check out [the example project](https://github.com/andrew-t/daily-game-kit/tree/main/example). You'll want to `npm install daily-game-kit` (or whatever the equivalent is for your setup) and then I use ES modules to import kit. I do this with [Parcel](https://parceljs.org/) just because it lets you use NPM modules and avoids issues where users have an imported JS module cached and end up with a version mismatch.

Then you need to make your config, which looks something like this:

```js
import dgKit from "daily-game-kit";

export const { storage, daily, updateExportData } = dgKit({
	name: "Example Game",
	namespace: "example", // a string that identifies your game. It must be unique among all games on your domain
	storedFields: {
		someSetting: {
            defaultValue: false,
            // The following settings are optional:
            exportTransform(value) {
                // Use this to change how the variable is serialised when exporting — this is useful if the naive JSON serialisation would be needlessly verbose
                return value ? "y" : "n";
            },
            importTransform(str) {
                // If you have set exportTransform, you should set importTransform to a function that reverses it.
                return str == "y";
            },
            exclude: false // if true, don't include this in data exports, useful for things like an undo stack which is huge and not important
        },
	},
	launchDate: "2024-12-26",
	skipDates: [], // days on which there is no new puzzle, intended for if you have a server outage or something and don't want to break people's streaks,
    allowFuturePuzzles: false // if true, you can access future puzzles with a URL flag for testing
});
```

You also need a folder called `puzzles` containing JSON files named `1.json`, etc for each day's puzzle.

Then in your main script,

```js
import { daily, storage } from "./config.js";

daily.loadPuzzle().then(puzzle => {
    // puzzle now contains the data from the JSON file for that day's puzzle, which you can use to build your puzzle.
}).catch(error => {
    console.error(error);
    alert("Unable to load puzzle");
});
```

There are functions called `onStart`, `onWin` and `onCheat` which mark a day's puzzle as started, completed and cheated — you can call them as much as you want and the kit will keep track of the "correct" option. There's also a set of custom HTML elements, such as `<today-next>` which shows a link to the current day's puzzle if you're doing an archived puzzle, or a timer to the next day's puzzle otherwise. Check the `example` folder in the git repo for examples of how to use them.

There are likely bugs and other nonsense in this library at the moment — I haven't yet used it in a real game. If you find any then [let me know](mailto:andrew@andrewt.net) and I'll try to fix them.
