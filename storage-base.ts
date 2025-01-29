import type { BuiltInData, Data, FullConfig, State } from "./config";

export default function namespace<DataType extends Data, StateType extends State>({ namespace, storedFields }: FullConfig<DataType, StateType>) {

	function wrapKey(key: string) {
		return `${namespace}_${key}`;
	}

	const data = {
		clear() {
			for (const key in storedFields)
				localStorage.removeItem(wrapKey(key));
		},
		export() {
			const j = {};
			for (const key in storedFields) {
				const field = storedFields[key];
				if (field.exclude) continue;
				j[key] = field.exportTransform ? field.exportTransform(data[key]) : data[key];
			}
			return btoa(JSON.stringify(j));
		},
		import(b64: string) {
			const j = JSON.parse(atob(b64));
			for (const key in j) {
				const field = storedFields[key];
				data[key] = field.importTransform ? field.importTransform(j[key]) : j[key];
			}
		}
	};

	for (const key in storedFields)
		Object.defineProperty(data, key, {
			get: () => JSON.parse(localStorage.getItem(wrapKey(key))) ?? storedFields[key].defaultValue,
			set: value => localStorage.setItem(wrapKey(key), JSON.stringify(value ?? null))
		});

	return data as typeof data & DataType & BuiltInData<StateType>;
}
