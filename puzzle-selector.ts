import { el } from "./dom";
import { PLAYED, COMPLETED, UNPLAYED, CHEATED, FAILED, Daily } from "./daily";
import { Data } from "./config";

const textResults = {
	[PLAYED]: "👀",
	[COMPLETED]: "🎉",
	undefined: "✨",
	[UNPLAYED]: "✨",
	[CHEATED]: "🔮",
	[FAILED]: "💀"
};

export default function initStreakStats<DataType extends Data>(
	storage: DataType,
	daily: Daily
) {
	class PuzzleSelector extends HTMLElement {
		constructor() {
			super();
			
			const game = el("select") as HTMLSelectElement;
			this.appendChild(game);

			let options: HTMLElement[] = [];

			for (let i = daily.todaysPuzzleId; i > 0; --i)
				options[i] = el('option', {
					text: optionText(i),
					attrs: { value: i.toString() },
					parent: game
				});

			game.value = daily.puzzleId;

			game.addEventListener('change', () => {
				if (game.value) window.location.search = `?p=${game.value}`;
			});

			window.addEventListener("storage", () => {
				for (let i = daily.todaysPuzzleId; i; --i)
					options[i].innerText = optionText(i);
			});
		}
	}

	customElements.define("puzzle-selector", PuzzleSelector);

	function optionText(i: number) {
		return textResults[storage.results[i]] + " " +
			(i == daily.todaysPuzzleId ? 'Today’s Puzzle': `Puzzle ${i}`);
	}
}
