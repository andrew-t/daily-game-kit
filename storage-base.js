export default function namespace({ namespace, defaults, exportTransforms, importTransforms, except }) {
	function wrapKey(key) {
		return `${namespace}_${key}`;
	}

	const data = {
		clear() {
			for (const key in defaults)
				localStorage.removeItem(wrapKey(key));
		},
		export() {
			const j = {};
			for (const key in defaults) if (!except.includes(key))
				j[key] = exportTransforms[key] ? exportTransforms[key](data[key]) : data[key];
			return btoa(JSON.stringify(j));
		},
		import(b64) {
			const j = JSON.parse(atob(b64));
			for (const key in j)
				data[key] = importTransforms[key] ? importTransforms[key](j[key]) : j[key];
		}
	};

	for (const key in defaults)
		Object.defineProperty(data, key, {
			get: () => JSON.parse(localStorage.getItem(wrapKey(key))) ?? defaults[key],
			set: value => localStorage.setItem(wrapKey(key), JSON.stringify(value ?? null))
		});

	return data;
}
