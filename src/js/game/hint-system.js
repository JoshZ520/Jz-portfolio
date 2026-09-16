export function createHintSystem(config) {
	const {
		state,
		hintTextEl,
		giveUpButton,
		formatters,
		giveUpGuessThreshold
	} = config;

	function updateHintText(message) {
		hintTextEl.textContent = message;
	}

	function updateGiveUpButtonVisibility() {
		const shouldShowGiveUp = !state.gameOver
			&& state.revealedHintCount >= state.hintMessages.length
			&& state.attemptsUsed > giveUpGuessThreshold;

		giveUpButton.classList.toggle("is-hidden", !shouldShowGiveUp);
	}

	function resetHints() {
		state.hintMessages = [];
		state.revealedHintCount = 0;
		updateHintText("Clues will appear as you investigate.");
		updateGiveUpButtonVisibility();
	}

	function setRoundHints() {
		if (!state.targetPokemonData || !state.targetSpeciesData || !state.targetGenerationData) {
			state.hintMessages = [];
			updateHintText("Clues are unavailable for this case.");
			updateGiveUpButtonVisibility();
			return;
		}

		const regionName = state.targetGenerationData.main_region?.name;

		state.hintMessages = [
			formatters.formatLabelValue("Typing", formatters.formatTypeList(state.targetPokemonData)),
			formatters.formatLabelValue("Generation", formatters.formatGenerationName(state.targetSpeciesData.generation.name)),
			formatters.formatLabelValue("Region", regionName ? formatters.formatDisplayText(regionName) : "Unknown"),
			formatters.formatLabelValue("Starts with", state.targetName.charAt(0).toUpperCase())
		];
		state.revealedHintCount = 0;
		updateHintText("Clues are ready. Your first incorrect guess will reveal one.");
		updateGiveUpButtonVisibility();
	}

	function revealNextHint() {
		if (state.revealedHintCount >= state.hintMessages.length) {
			return "No more clues available.";
		}

		state.revealedHintCount += 1;
		const visibleHints = state.hintMessages.slice(0, state.revealedHintCount);
		updateHintText(visibleHints.join("\n"));
		updateGiveUpButtonVisibility();
		return visibleHints[visibleHints.length - 1];
	}

	return {
		updateHintText,
		updateGiveUpButtonVisibility,
		resetHints,
		setRoundHints,
		revealNextHint
	};
}
