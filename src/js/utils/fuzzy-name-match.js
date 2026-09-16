function levenshteinDistance(a, b) {
	if (a === b) {
		return 0;
	}

	if (!a) {
		return b.length;
	}

	if (!b) {
		return a.length;
	}

	const previousRow = new Array(b.length + 1);
	const currentRow = new Array(b.length + 1);

	for (let column = 0; column <= b.length; column += 1) {
		previousRow[column] = column;
	}

	for (let row = 1; row <= a.length; row += 1) {
		currentRow[0] = row;

		for (let column = 1; column <= b.length; column += 1) {
			const substitutionCost = a[row - 1] === b[column - 1] ? 0 : 1;
			currentRow[column] = Math.min(
				currentRow[column - 1] + 1,
				previousRow[column] + 1,
				previousRow[column - 1] + substitutionCost
			);
		}

		for (let column = 0; column <= b.length; column += 1) {
			previousRow[column] = currentRow[column];
		}
	}

	return previousRow[b.length];
}

export function findClosestPokemonName(query, names, options = {}) {
	const {
		maxDistance = 2,
		maxCandidates = 80
	} = options;

	if (!query || !Array.isArray(names) || names.length === 0) {
		return "";
	}

	const firstLetterMatches = names.filter((name) => name.startsWith(query.charAt(0))).slice(0, maxCandidates);
	const candidates = firstLetterMatches.length > 0 ? firstLetterMatches : names.slice(0, maxCandidates);

	let bestName = "";
	let bestDistance = Number.POSITIVE_INFINITY;

	for (const candidate of candidates) {
		const distance = levenshteinDistance(query, candidate);
		if (distance < bestDistance) {
			bestDistance = distance;
			bestName = candidate;
		}
	}

	if (bestDistance > maxDistance) {
		return "";
	}

	return bestName;
}
