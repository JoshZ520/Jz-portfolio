export function createInitialState() {
	return {
		targetId: null,
		targetName: "",
		attemptsUsed: 0,
		gameOver: false,
		hintMessages: [],
		revealedHintCount: 0,
		targetPokemonData: null,
		targetSpeciesData: null,
		targetGenerationData: null
	};
}

export function resetRoundState(state) {
	state.targetId = null;
	state.targetName = "";
	state.attemptsUsed = 0;
	state.gameOver = false;
	state.hintMessages = [];
	state.revealedHintCount = 0;
	state.targetPokemonData = null;
	state.targetSpeciesData = null;
	state.targetGenerationData = null;
}
