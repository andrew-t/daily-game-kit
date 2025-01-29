import { BuiltInData, State } from "./config";
import dailyInit, { COMPLETED } from "./daily";

abstract class StreakDom extends HTMLElement {
    constructor() {
        super();
        this.update();
        window.addEventListener("storage", () => this.update());
    }

    abstract update(): void;
}

export default function initStreakStats(storage: BuiltInData<State>, daily: ReturnType<typeof dailyInit>) {
    class CurrentStreak extends StreakDom {
        update() {
            this.innerHTML =
            (storage.nextPuzzle >= daily.todaysPuzzleId ? storage.streak : 0).toString();
        }
    }

    customElements.define("current-streak", CurrentStreak);

    class BestStreak extends StreakDom {
        update() {
            this.innerHTML = storage.bestStreak.toString();
        }
    }

    customElements.define("best-streak", BestStreak);

    class CompletionPercent extends StreakDom {
        update() {
            this.innerHTML = Math.floor(
                Object.values(storage.results).reduce((a, n) => a + +(n == COMPLETED), 0) * 100 / daily.todaysPuzzleId
            ) + "%";
        }
    }

    customElements.define("completion-percent", CompletionPercent);

    class PuzzleId extends StreakDom {
        update() {
            this.innerHTML = daily.puzzleId.replace(/\+/,'');
        }
    }

    customElements.define("puzzle-id", PuzzleId);

    class StartText extends StreakDom {
        update() {
            this.innerHTML = daily.isTodaysPuzzle ? "Start" : `Start puzzle #${daily.puzzleId}`;
        }
    }
    customElements.define("start-text", StartText);
}
