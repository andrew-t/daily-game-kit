export default async function getJson(fn: string) {
	const response = await fetch(fn);
	if (response.status > 200) throw new Error(`HTTP ${response.status} error`);
	return await response.json();
}
