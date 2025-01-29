# daily-game-kit

If you've played my daily games, [Cell Tower](https://www.andrewt.net/puzzles/cell-tower), [Celtix](https://www.andrewt.net/puzzles/celtix), [Ronin](https://www.andrewt.net/puzzles/ronin) and [3Doku](https://www.andrewt.net/puzzles/3doku), you've probably noticed I re-use a lot of the systems between games. All of them feature streaks, a puzzle selector, savable settings, etc. When I first built Cell Tower I didn't create a whole library of tools to power it, but I did design its systems to be re-used. Now that I've released my fourth daily game, I thought it was time to finally pull all the reusable parts into a single library that I could use to build other games. And since I was doing that, why not let other people use it too?

This package gives you all the nuts and bolts of the daily game setup, including working out what day it is and loading the day's puzzle. It won't control anything else — you'll need to generate puzzles, build the player, call the functions, etc yourself.

# How to use