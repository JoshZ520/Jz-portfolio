export function createRoundController(config) {
	const {
		state,
		ui,
		api,
		roundState,
		randomUtils,
		formatters,
		hintSystem,
		autocomplete,
		pokedexModal,
		maxPokemonId
	} = config;

	function updateAttemptsUI() {
		ui.attemptsText.textContent = `Guesses logged: ${state.attemptsUsed}`;
	}

	function setGuessInputEnabled(isEnabled) {
		ui.pokemonIdInput.disabled = !isEnabled;
		ui.loadPokemonButton.disabled = !isEnabled;
	}

	function clearGuessCards() {
		ui.guessCards.innerHTML = "";
	}

	function showGameScreen() {
		ui.introScreen.classList.add("is-hidden");
		ui.gameScreen.classList.remove("is-hidden");
		ui.gameScreen.setAttribute("aria-hidden", "false");
		ui.newRoundButton.focus();
	}

	function addGuessCard(name, id, spriteUrl, wasCorrect) {
		const card = document.createElement("article");
		const outcomeText = wasCorrect ? "Match" : "Not a match";
		card.textContent = `${outcomeText}: ${name} (#${id})`;

		if (spriteUrl) {
			const image = document.createElement("img");
			image.src = spriteUrl;
			image.alt = `${name} sprite`;
			card.appendChild(document.createTextNode(" "));
			card.appendChild(image);
		}

		ui.guessCards.appendChild(card);
	}

	function buildPokedexEntryData() {
		if (!state.targetPokemonData || !state.targetSpeciesData) {
			return null;
		}

		return {
			name: formatters.formatDisplayText(state.targetPokemonData.name),
			number: formatters.formatPokedexNumber(state.targetPokemonData.id),
			spriteUrl: state.targetPokemonData.sprites.front_default || "",
			spriteAlt: `${formatters.formatDisplayText(state.targetPokemonData.name)} sprite`,
			typing: formatters.formatLabelValue("Typing", formatters.formatTypeList(state.targetPokemonData)),
			height: formatters.formatLabelValue("Height", formatters.formatHeight(state.targetPokemonData.height)),
			weight: formatters.formatLabelValue("Weight", formatters.formatWeight(state.targetPokemonData.weight)),
			abilities: formatters.formatLabelValue("Abilities", formatters.formatAbilityList(state.targetPokemonData)),
			stats: formatters.formatBaseStats(state.targetPokemonData),
			flavorText: formatters.getPreferredFlavorText(state.targetSpeciesData)
		};
	}

	function openPokedexEntryModal() {
		const entryData = buildPokedexEntryData();
		if (!entryData || !pokedexModal) {
			return;
		}

		pokedexModal.open(entryData);
	}

	function revealRoundAnswer(statusMessage) {
		state.gameOver = true;
		setGuessInputEnabled(false);
		hintSystem.updateGiveUpButtonVisibility();
		ui.statusText.textContent = statusMessage;
		openPokedexEntryModal();
	}

	function resetRoundStateForNewGame() {
		if (pokedexModal) {
			pokedexModal.close({
				restoreFocus: false
			});
		}

		roundState.resetRoundState(state);
		hintSystem.resetHints();
	}

	async function startNewRound() {
		resetRoundStateForNewGame();
		updateAttemptsUI();
		setGuessInputEnabled(false);
		clearGuessCards();
		ui.pokemonIdInput.value = "";
		autocomplete.renderForQuery("");
		ui.roundTargetText.textContent = "Case file loading...";
		ui.statusText.textContent = "Starting a new case...";

		const randomId = randomUtils.getRoundPokemonId(maxPokemonId);

		try {
			const pokemonData = await api.fetchPokemonByIdOrName(randomId);
			const speciesData = await api.fetchSpeciesByUrl(pokemonData.species.url);
			const generationData = await api.fetchGenerationByUrl(speciesData.generation.url);

			state.targetPokemonData = pokemonData;
			state.targetSpeciesData = speciesData;
			state.targetGenerationData = generationData;
			state.targetId = state.targetPokemonData.id;
			state.targetName = state.targetPokemonData.name;
			hintSystem.setRoundHints();

			ui.roundTargetText.textContent = `Case number: ${state.targetId}`;
			ui.statusText.textContent = "Case ready. Name your suspect.";
			setGuessInputEnabled(true);
			ui.pokemonIdInput.focus();
		} catch (error) {
			if (error.status) {
				ui.statusText.textContent = `Unable to load case (${error.status}). Try Next Case again.`;
			} else {
				ui.statusText.textContent = "Network issue while loading case. Try Next Case again.";
			}
			ui.roundTargetText.textContent = "Case number: --";
		}
	}

	return {
		updateAttemptsUI,
		setGuessInputEnabled,
		clearGuessCards,
		showGameScreen,
		addGuessCard,
		revealRoundAnswer,
		startNewRound
	};
}
