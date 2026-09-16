export function getRandomPokemonId(maxPokemonId) {
	return Math.floor(Math.random() * maxPokemonId) + 1;
}

export function getRoundPokemonId(maxPokemonId) {
	return getRandomPokemonId(maxPokemonId);
}
