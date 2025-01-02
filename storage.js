import storageNamespace from "./storage-base.js";
import { initQuery } from "./query-string.js";
import { el } from "./dom.js";

const elements = [];

class ExportQrCode extends HTMLElement {
	constructor() {
		super();
		elements.push(this);
	}
	update(url) {
		this.innerHTML = '';
		try {
			const qr = qrcode(4, 'L');
			qr.addData(url);
			qr.make();
			this.innerHTML = qr.createImgTag();
			document.body.classList.remove("qr-code-failed");
		} catch (e) {
			console.error("Error creating QR code", e);
			document.body.classList.add("qr-code-failed");
		}
	}
}
customElements.define("export-qr-code", ExportQrCode);

class ExportLink extends HTMLElement {
	constructor() {
		super();
		elements.push(this);
		this.link = el('a');
		for (const c of [...this.children]) {
			this.remove(c);
			this.link.appendChild(c);
		}
		this.appendChild(this.link);
	}
	update(url) {
		this.link.setAttribute('href', url);
	}
}
customElements.define("export-link", ExportLink);

export default function gameStorage(config) {
	const storage = storageNamespace(config);

	if (initQuery.data) {
		if (confirm(`Would you like to import your ${config.name} data from your other device? This will overwrite any data you have stored on this device.`))
			storage.import(initQuery.data);
		location.search = '';
	}

	return {
		updateExportData() {
			const url = `${location.origin}${location.pathname}?data=${storage.export(noExport, exportTransforms)}`;
			for (const el of elements) el.update(url);
		},

		clearStorage() {
			storage.clear();
			location.reload();
		},

		storage
	}
}
