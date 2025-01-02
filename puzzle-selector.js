import { el } from "./dom.js";
import { PLAYED, COMPLETED, UNPLAYED, CHEATED, FAILED } from "./daily.js";

const textResults = {
	[PLAYED]: "👀",
	[COMPLETED]: "🎉",
	undefined: "✨",
	[UNPLAYED]: "✨",
	[CHEATED]: "🔮",
	[FAILED]: "💀"
};

export default function initStreakStats(storage, daily) {
	class PuzzleSelector extends HTMLElement {
		constructor() {
			super();
			
			const game = el("select");
			this.appendChild(game);

			for (let i = daily.todaysPuzzleId; i; --i)
				el('option', {
					text: optionText(i),
					attrs: { value: i },
					parent: game
				});

			game.value = daily.puzzleId;

			game.addEventListener('change', (e) => {
				const i = e.target.value;
				if (i) window.location.search = `?p=${i}`;
			});
		}
	}

	customElements.define("puzzle-selector", PuzzleSelector);

	function optionText(i) {
		return textResults[storage.results[i]] + " " +
			(i == daily.todaysPuzzleId ? 'Today’s Puzzle': `Puzzle ${i}`);
	}
}
