import { COMPLETED } from "./daily.js";

export default function initStreakStats(storage, daily) {
    class CurrentStreak extends HTMLElement {
        constructor() {
            super();
            this.innerHTML =
            storage.nextPuzzle >= daily.todaysPuzzleId ? storage.streak : 0;
        }
    }

    customElements.define("current-streak", CurrentStreak);

    class BestStreak extends HTMLElement {
        constructor() {
            super();
            this.innerHTML = storage.bestStreak;
        }
    }

    customElements.define("best-streak", BestStreak);

    class CompletionPercent extends HTMLElement {
        constructor() {
            super();
            this.innerHTML = Math.floor(
                Object.values(storage.results).reduce((a, n) => a + (n == COMPLETED), 0) * 100 / daily.puzzleId
            ) + "%";
        }
    }

    customElements.define("completion-percent", CompletionPercent);

    class PuzzleId extends HTMLElement {
        constructor() {
            super();
            this.innerHTML = daily.puzzleId.replace(/\+/,'');
        }
    }

    customElements.define("puzzle-id", PuzzleId);

    class StartText extends HTMLElement {
        constructor() {
            super();
            this.innerHTML = daily.isTodaysPuzzle ? "Start" : `Start puzzle #${daily.puzzleId}`;
        }
    }
    customElements.define("start-text", StartText);
}
