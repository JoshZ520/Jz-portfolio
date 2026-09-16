export async function loadPokemonNameList() {
	const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
	if (!response.ok) {
		throw new Error(`Failed to load pokemon names (${response.status})`);
	}

	const data = await response.json();
	return data.results.map((pokemon) => pokemon.name);
}
