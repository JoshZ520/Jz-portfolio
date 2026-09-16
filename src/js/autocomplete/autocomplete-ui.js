export function createAutocompleteController(config) {
	const {
		inputEl,
		suggestionsEl,
		pokemonNames,
		formatDisplayText,
		normalizePokemonName,
		getEvolutionFamilyNames,
		maxSuggestions,
		maxFamilySeeds,
		minQueryLengthForEvolutionExpansion
	} = config;

	let renderRequestId = 0;

	function clear() {
		suggestionsEl.innerHTML = "";
		suggestionsEl.classList.add("is-hidden");
	}

	function renderSuggestionOptions(names) {
		clear();

		if (names.length === 0) {
			return;
		}

		for (const name of names) {
			const suggestionButton = document.createElement("button");
			suggestionButton.type = "button";
			suggestionButton.className = "autocomplete-suggestion";
			suggestionButton.setAttribute("role", "option");
			suggestionButton.dataset.value = name;
			suggestionButton.textContent = formatDisplayText(name);
			suggestionButton.addEventListener("mousedown", (event) => {
				event.preventDefault();
			});
			suggestionButton.addEventListener("click", () => {
				inputEl.value = name;
				clear();
				inputEl.focus();
			});
			suggestionsEl.appendChild(suggestionButton);
		}

		suggestionsEl.classList.remove("is-hidden");
	}

	function getTopSuggestion() {
		const firstSuggestionButton = suggestionsEl.querySelector(".autocomplete-suggestion");
		if (!firstSuggestionButton) {
			return "";
		}

		return firstSuggestionButton.dataset.value || "";
	}

	function hasExactMatch(inputText) {
		const normalizedQuery = normalizePokemonName(inputText);
		if (!normalizedQuery) {
			return false;
		}

		return pokemonNames.includes(normalizedQuery);
	}

	async function renderForQuery(queryText) {
		const requestId = ++renderRequestId;
		const normalizedQuery = queryText.trim().toLowerCase().replace(/\s+/g, "-");
		if (!normalizedQuery) {
			clear();
			return;
		}

		const matchingNames = pokemonNames
			.filter((name) => name.startsWith(normalizedQuery))
			.slice(0, maxSuggestions);

		renderSuggestionOptions(matchingNames);

		if (normalizedQuery.length < minQueryLengthForEvolutionExpansion || matchingNames.length === 0) {
			return;
		}

		const familySeeds = matchingNames.slice(0, maxFamilySeeds);
		const mergedSuggestions = [...matchingNames];
		const seenSuggestions = new Set(mergedSuggestions);

		for (const seedName of familySeeds) {
			try {
				const familyNames = await getEvolutionFamilyNames(seedName);

				for (const familyName of familyNames) {
					if (seenSuggestions.has(familyName)) {
						continue;
					}

					seenSuggestions.add(familyName);
					mergedSuggestions.push(familyName);

					if (mergedSuggestions.length >= maxSuggestions) {
						break;
					}
				}

				if (mergedSuggestions.length >= maxSuggestions) {
					break;
				}
			} catch (error) {
				// Keep base autocomplete results if evolution lookup fails.
			}
		}

		if (requestId !== renderRequestId) {
			return;
		}

		renderSuggestionOptions(mergedSuggestions.slice(0, maxSuggestions));
	}

	return {
		clear,
		renderForQuery,
		getTopSuggestion,
		hasExactMatch
	};
}
