export function createGuessHandler(config) {
	const {
		state,
		ui,
		api,
		normalizers,
		formatters,
		pokemonNames,
		fuzzyNameMatch,
		hintSystem,
		autocomplete,
		roundController
	} = config;

	async function handleSubmit(event) {
		event.preventDefault();

		if (state.gameOver) {
			ui.statusText.textContent = "This case is closed. Open a new case to continue.";
			return;
		}

		if (!state.targetName || !state.targetId) {
			ui.statusText.textContent = "Open a case first.";
			return;
		}

		const guessedName = normalizers.normalizePokemonName(ui.pokemonIdInput.value);

		if (!guessedName) {
			ui.statusText.textContent = "Enter a suspect name.";
			return;
		}

		ui.statusText.textContent = "Checking case records...";

		try {
			const data = await api.fetchPokemonByIdOrName(guessedName);
			const guessedPokemonName = data.name;
			const guessedPokemonId = data.id;
			const guessedSpriteUrl = data.sprites.front_default || "";

			if (guessedPokemonName === state.targetName) {
				roundController.addGuessCard(guessedPokemonName, guessedPokemonId, guessedSpriteUrl, true);
				roundController.revealRoundAnswer(`Confirmed. ${guessedPokemonName} is #${state.targetId}.`);
				return;
			}

			state.attemptsUsed += 1;
			roundController.updateAttemptsUI();
			roundController.addGuessCard(guessedPokemonName, guessedPokemonId, guessedSpriteUrl, false);
			hintSystem.revealNextHint();
			hintSystem.updateGiveUpButtonVisibility();

			ui.statusText.textContent = `Not a match: ${guessedPokemonName} is #${guessedPokemonId}. Continue investigating.`;
			ui.pokemonIdInput.value = "";
			autocomplete.renderForQuery("");
			ui.pokemonIdInput.focus();
		} catch (error) {
			if (error.status === 404) {
				const suggestedName = fuzzyNameMatch.findClosestPokemonName(guessedName, pokemonNames);
				if (suggestedName) {
					ui.statusText.textContent = `Name not found (404). Did you mean ${formatters.formatDisplayText(suggestedName)}?`;
				} else {
					ui.statusText.textContent = "Name not found (404). Try another spelling.";
				}
				return;
			}

			if (error.status) {
				ui.statusText.textContent = `Name not found (${error.status}). Try another spelling.`;
				return;
			}

			ui.statusText.textContent = "Network issue. Check connection and try again.";
		}
	}

	return {
		handleSubmit
	};
}
