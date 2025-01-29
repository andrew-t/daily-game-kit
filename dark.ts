import type { BuiltInData, State } from "./config";
import { el } from "./dom";

export const ON = 'ON';
export const OFF = 'OFF';
export const SYSTEM = 'SYS';

export default function initDark(storage: BuiltInData<State>) {
	init(
        '(prefers-color-scheme: dark)',
        'dark-mode',
        storage,
        'dark',
        {
            legend: "Theme",
            on: "Dark",
            off: "Light",
            system: "Follow system setting"
        });
    init(
        '(prefers-reduced-motion: reduce)',
        'reduced-motion',
        storage,
        "reducedMotion",
        {
            legend: "Animations",
            on: "Reduced",
            off: "Full",
            system: "Follow system setting"
        });
}

type EventName = "enable" | "disable" | "change";

function init(
    queryString: string,
    bodyClass: string,
    storage: BuiltInData<State>,
    storageKey: string,
    strings: { legend: string, on: string, off: string, system: string }
) {
    const mode = storage[storageKey];
	const query = window.matchMedia(queryString);
	const listeners: Record<EventName, Function[]> = { enable: [], disable: [], change: [] };

	const returnedObject = {
		active: mode == ON ? true : (mode == OFF ? false : query.matches),
		mode,
		addEventListener(e: EventName, cb: Function) {
			listeners[e].push(cb);
		},
		removeEventListener(e: EventName, cb: Function) {
			listeners[e] = listeners[e].filter(x => x != cb);
		},
		setOn() {
			returnedObject.mode = ON;
            storage[storageKey] = ON;
			if (returnedObject.active) return;
			returnedObject.active = true;
			update();
		},
		setOff() {
			returnedObject.mode = OFF;
            storage[storageKey] = OFF;
			if (!returnedObject.active) return;
			returnedObject.active = false;
			update();
		},
		setSystem() {
			returnedObject.mode = SYSTEM;
            storage[storageKey] = SYSTEM;
			if (returnedObject.active == query.matches) return;
			returnedObject.active = query.matches;
			update();
		}
	};

	setBodyClass();

	query.addEventListener('change', event => {
		if (returnedObject.mode != SYSTEM) return;
		returnedObject.active = event.matches;
		update();
	});

    class RadioButtons extends HTMLElement {
        constructor() {
            super();

            const fs = el("fieldset", { parent: this });
            el("legend", { text: strings.legend, parent: fs });

            const on = el("input", {
                parent: el("label", { parent: fs, children: [ el("span", { text: strings.on }) ], }),
                attrs: { type: "radio", value: ON, name: bodyClass },
                on: { click: () => returnedObject.setOn() }
            }) as HTMLInputElement;
            const off = el("input", {
                parent: el("label", { parent: fs, children: [ el("span", { text: strings.off }) ], }),
                attrs: { type: "radio", value: OFF, name: bodyClass },
                on: { click: () => returnedObject.setOff() }
            }) as HTMLInputElement;
            const system = el("input", {
                parent: el("label", { parent: fs, children: [ el("span", { text: strings.system }) ], }),
                attrs: { type: "radio", value: SYSTEM, name: bodyClass },
                on: { click: () => returnedObject.setSystem() }
            }) as HTMLInputElement;
        
            switch(mode) {
                case ON: on.checked = true; break;
                case OFF: off.checked = true; break;
                case SYSTEM: system.checked = true; break;
            }
        }
    }

    customElements.define(bodyClass, RadioButtons);

	return returnedObject;

	function update() {
		setBodyClass();
		if (returnedObject.active) for (const cb of listeners.enable) cb();
		else for (const cb of listeners.disable) cb();
		for (const cb of listeners.change) cb(returnedObject.active);
	}

	function setBodyClass() {
		if (returnedObject.active) document.body.classList.add(bodyClass);
		else document.body.classList.remove(bodyClass);
	}
}
