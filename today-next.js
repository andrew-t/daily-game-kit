import { oneDay } from "./daily.js";
import { el } from "./dom.js";

export default function initTodayNext(daily) {
	class TodayNext extends HTMLElement {
		constructor() {
			super();
			this.render();
			
			this.timer = el("span", {
				classList: "timer",
				parent: el("span", {
					text: "Next puzzle in ",
					parent: this
				})
			});

			this.h = setInterval(() => this.update(), 1000);
			this.update();
		}
		
		update() {
			const ms = (epoch + daily.todaysPuzzleId * oneDay - Date.now()) % oneDay,
				s = ~~(ms / 1000);
			if (s < 0) {
				self.innerHTML = '<a href="?">Play today’s puzzle</a>';
				clearInterval(this.h);
				this.h = null;
			} else
			this.timer.innerHTML = `${pad(~~(s/3600))}:${pad(~~(s/60)%60)}:${pad(s%60)}`;
		}
	}

	customElements.define("today-next", TodayNext);
}

function pad(n) { return n > 9 ? `${n}` : `0${n}` }
