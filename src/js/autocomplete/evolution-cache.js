export function createEvolutionCache(api) {
	const evolutionFamilyCache = new Map();
	const evolutionFamilyInFlight = new Map();

	function collectEvolutionFamilyNames(chainNode, familyNames) {
		if (!chainNode || !chainNode.species) {
			return;
		}

		familyNames.add(chainNode.species.name);

		for (const evolvesToNode of chainNode.evolves_to || []) {
			collectEvolutionFamilyNames(evolvesToNode, familyNames);
		}
	}

	async function getEvolutionFamilyNames(name) {
		if (evolutionFamilyCache.has(name)) {
			return evolutionFamilyCache.get(name);
		}

		if (evolutionFamilyInFlight.has(name)) {
			return evolutionFamilyInFlight.get(name);
		}

		const familyPromise = (async () => {
			const speciesData = await api.fetchSpeciesByName(name);
			const evolutionData = await api.fetchEvolutionChainByUrl(speciesData.evolution_chain.url);
			const familySet = new Set();
			collectEvolutionFamilyNames(evolutionData.chain, familySet);
			const familyList = [...familySet];

			for (const familyName of familyList) {
				evolutionFamilyCache.set(familyName, familyList);
			}

			return familyList;
		})();

		evolutionFamilyInFlight.set(name, familyPromise);

		try {
			return await familyPromise;
		} finally {
			evolutionFamilyInFlight.delete(name);
		}
	}

	return {
		getEvolutionFamilyNames
	};
}
