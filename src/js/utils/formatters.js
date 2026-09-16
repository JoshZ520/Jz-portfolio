export function formatLabelValue(label, value) {
	return `${label}: ${value}`;
}

export function formatDisplayText(rawText) {
	return rawText
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

export function formatGenerationName(generationName) {
	const generationSuffix = generationName.replace("generation-", "");
	const romanToNumber = {
		i: "1",
		ii: "2",
		iii: "3",
		iv: "4",
		v: "5",
		vi: "6",
		vii: "7",
		viii: "8",
		ix: "9"
	};

	return romanToNumber[generationSuffix] || generationSuffix.toUpperCase();
}

export function formatTypeList(pokemonData) {
	return pokemonData.types
		.map((entry) => formatDisplayText(entry.type.name))
		.join(" / ");
}

export function formatHeight(heightValue) {
	return `${(heightValue / 10).toFixed(1)} m`;
}

export function formatWeight(weightValue) {
	return `${(weightValue / 10).toFixed(1)} kg`;
}

export function formatAbilityList(pokemonData) {
	return pokemonData.abilities
		.map((entry) => formatDisplayText(entry.ability.name))
		.join(", ");
}

export function formatStatLabel(statName) {
	const statLabels = {
		hp: "HP",
		attack: "Attack",
		defense: "Defense",
		"special-attack": "Sp. Atk",
		"special-defense": "Sp. Def",
		speed: "Speed"
	};

	return statLabels[statName] || formatDisplayText(statName);
}

export function formatBaseStats(pokemonData) {
	return pokemonData.stats.map((entry) => ({
		label: formatStatLabel(entry.stat.name),
		value: entry.base_stat
	}));
}

export function cleanFlavorText(flavorText) {
	return flavorText.replace(/[\f\n\r]+/g, " ").replace(/\s+/g, " ").trim();
}

export function getPreferredFlavorText(speciesData) {
	const englishEntries = speciesData.flavor_text_entries.filter((entry) => entry.language.name === "en");
	const modernEntry = [...englishEntries].reverse().find((entry) => entry.version.name !== "red" && entry.version.name !== "blue");
	const chosenEntry = modernEntry || englishEntries[0];

	if (!chosenEntry) {
		return "No Pokedex entry available.";
	}

	return cleanFlavorText(chosenEntry.flavor_text);
}

export function formatPokedexNumber(pokemonId) {
	return `#${String(pokemonId).padStart(3, "0")}`;
}
