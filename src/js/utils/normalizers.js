export function normalizePokemonName(nameText) {
	return nameText.trim().toLowerCase().replace(/\s+/g, "-");
}
