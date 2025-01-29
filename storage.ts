import QrCreator from 'qr-creator';

import storageNamespace from "./storage-base";
import { initQuery } from "./query-string";
import { el } from "./dom";
import { Data, FullConfig, State } from "./config";

const elements: Array<ExportQrCode | ExportLink> = [];

export type StorageModule<DataType extends Data, StateType extends State> = ReturnType<typeof gameStorage<DataType, StateType>>;
export type Storage<DataType extends Data, StateType extends State> = ReturnType<typeof gameStorage<DataType, StateType>>;

class ExportQrCode extends HTMLElement {
	constructor() {
		super();
		elements.push(this);
	}
	update(url: string) {
		this.innerHTML = '';
		try {
			QrCreator.render({
				text: url,
				radius: 0.25, // 0.0 to 0.5
				ecLevel: 'L', // L, M, Q, H
				fill: '#000000', // foreground color
				background: null, // color or null for transparent
				size: 1024 // in pixels
			}, this);
			document.body.classList.remove("qr-code-failed");
		} catch (e) {
			console.error("Error creating QR code", e);
			document.body.classList.add("qr-code-failed");
		}
	}
}
customElements.define("export-qr-code", ExportQrCode);

class ExportLink extends HTMLElement {
	link: HTMLAnchorElement;

	constructor() {
		super();
		elements.push(this);
		this.link = el('a') as HTMLAnchorElement;
		for (const c of [...this.childNodes]) {
			c.remove();
			this.link.appendChild(c);
		}
		this.appendChild(this.link);
	}
	update(url: string) {
		this.link.setAttribute('href', url);
	}
}
customElements.define("export-link", ExportLink);

export default function gameStorage<DataType extends Data, StateType extends State>(config: FullConfig<DataType, StateType>) {
	const storage = storageNamespace(config);

	if (initQuery.data) {
		if (confirm(`Would you like to import your ${config.name} data from your other device? This will overwrite any data you have stored on this device.`))
			storage.import(initQuery.data);
		location.search = '';
	}

	return {
		updateExportData() {
			const url = `${location.origin}${location.pathname}?data=${storage.export()}`;
			for (const el of elements) el.update(url);
		},

		clearStorage() {
			storage.clear();
			location.reload();
		},

		storage
	}
}
