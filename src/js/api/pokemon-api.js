async function fetchJson(url) {
	const response = await fetch(url);
	if (!response.ok) {
		const error = new Error(`Request failed (${response.status})`);
		error.status = response.status;
		error.url = url;
		throw error;
	}

	return response.json();
}

export function fetchPokemonByIdOrName(idOrName) {
	return fetchJson(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(String(idOrName))}`);
}

export function fetchSpeciesByName(name) {
	return fetchJson(`https://pokeapi.co/api/v2/pokemon-species/${encodeURIComponent(name)}`);
}

export function fetchSpeciesByUrl(url) {
	return fetchJson(url);
}

export function fetchGenerationByUrl(url) {
	return fetchJson(url);
}

export function fetchEvolutionChainByUrl(url) {
	return fetchJson(url);
}
