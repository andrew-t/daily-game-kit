import { el } from "./dom.js";

export const ON = 'ON';
export const OFF = 'OFF';
export const SYSTEM = 'SYS';

export default function initDark(storage) {
	init(
        '(prefers-color-scheme: dark)',
        'dark-mode',
        storage,
        'darkMode',
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

function init(
    queryString,
    bodyClass,
    storage,
    storageKey,
    strings
) {
    const mode = storage[storageKey];
	const query = window.matchMedia(queryString);
	const listeners = { enable: [], disable: [], change: [] };

	const returnedObject = {
		active: mode == ON ? true : (mode == OFF ? false : query.matches),
		mode,
		addEventListener(e, cb) {
			listeners[e].push(cb);
		},
		removeEventListener(e, cb) {
			listeners[e] = listeners[e].filter(x => x != cb);
		},
		setOn() {
			returnedObject.mode = ON;
            storage[storageKey] = [ON];
			if (returnedObject.active) return;
			returnedObject.active = true;
			update();
		},
		setOff() {
			returnedObject.mode = OFF;
            storage[storageKey] = [OFF];
			if (!returnedObject.active) return;
			returnedObject.active = false;
			update();
		},
		setSystem() {
			returnedObject.mode = SYSTEM;
            storage[storageKey] = [SYSTEM];
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

            const fs = el("fieldset");
            el("legend", { text: strings.legend, parent: fs });

            const on = el("input", {
                text: strings.on,
                parent: fs,
                attrs: { value: ON, name: bodyClass },
                on: { click: () => returnedObject.setOn() }
            });
            const off = el("input", {
                text: strings.off,
                parent: fs,
                attrs: { value: OFF, name: bodyClass },
                on: { click: () => returnedObject.setOff() }
            });
            const system = el("input", {
                text: strings.system,
                parent: fs,
                attrs: { value: SYSTEM, name: bodyClass },
                on: { click: () => returnedObject.setSystem() }
            });
        
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
