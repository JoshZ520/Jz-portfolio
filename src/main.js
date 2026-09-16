import * as api from "./js/api/pokemon-api.js";
import { loadPokemonNameList } from "./js/api/pokemon-names.js";
import { createEvolutionCache } from "./js/autocomplete/evolution-cache.js";
import { createAutocompleteController } from "./js/autocomplete/autocomplete-ui.js";
import { createGuessHandler } from "./js/game/guess-handler.js";
import { createHintSystem } from "./js/game/hint-system.js";
import { createRoundController } from "./js/game/round-logic.js";
import * as roundState from "./js/game/round-state.js";
import { createPokedexModal } from "./js/modal/pokedex-modal.js";
import { findClosestPokemonName } from "./js/utils/fuzzy-name-match.js";
import * as formatters from "./js/utils/formatters.js";
import { normalizePokemonName } from "./js/utils/normalizers.js";
import * as randomUtils from "./js/utils/random.js";

const ui = {
	introScreen: document.getElementById("intro-screen"),
	gameScreen: document.getElementById("game-screen"),
	startGameButton: document.getElementById("start-game-btn"),
	loadPokemonButton: document.getElementById("load-pokemon-btn"),
	newRoundButton: document.getElementById("new-round-btn"),
	giveUpButton: document.getElementById("give-up-btn"),
	guessForm: document.getElementById("guess-form"),
	pokemonIdInput: document.getElementById("pokemon-id-input"),
	statusText: document.getElementById("status-text"),
	roundTargetText: document.getElementById("round-target"),
	attemptsText: document.getElementById("attempts-text"),
	hintText: document.getElementById("hint-text"),
	autocompleteSuggestions: document.getElementById("autocomplete-suggestions"),
	guessCards: document.getElementById("guess-cards")
};

const maxPokemonId = 1025;
const giveUpGuessThreshold = 5;
const maxAutocompleteSuggestions = 20;
const maxAutocompleteFamilySeeds = 3;
const minQueryLengthForEvolutionExpansion = 2;

const state = roundState.createInitialState();
const pokemonNames = [];
const pokedexModal = createPokedexModal();

const evolutionCache = createEvolutionCache(api);
const autocomplete = createAutocompleteController({
	inputEl: ui.pokemonIdInput,
	suggestionsEl: ui.autocompleteSuggestions,
	pokemonNames,
	formatDisplayText: formatters.formatDisplayText,
	normalizePokemonName,
	getEvolutionFamilyNames: evolutionCache.getEvolutionFamilyNames,
	maxSuggestions: maxAutocompleteSuggestions,
	maxFamilySeeds: maxAutocompleteFamilySeeds,
	minQueryLengthForEvolutionExpansion
});

const hintSystem = createHintSystem({
	state,
	hintTextEl: ui.hintText,
	giveUpButton: ui.giveUpButton,
	formatters,
	giveUpGuessThreshold
});

const roundController = createRoundController({
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
});

const guessHandler = createGuessHandler({
	state,
	ui,
	api,
	normalizers: {
		normalizePokemonName
	},
	formatters,
	pokemonNames,
	fuzzyNameMatch: {
		findClosestPokemonName
	},
	hintSystem,
	autocomplete,
	roundController
});

async function loadPokemonNameSuggestions() {
	try {
		const names = await loadPokemonNameList();
		pokemonNames.length = 0;
		pokemonNames.push(...names);
	} catch (error) {
		// Keep gameplay functional even if autocomplete data cannot load.
	}
}

ui.statusText.textContent = "Click Next Case to begin.";
roundController.updateAttemptsUI();
roundController.setGuessInputEnabled(false);
hintSystem.resetHints();
loadPokemonNameSuggestions();

ui.startGameButton.addEventListener("click", async () => {
	roundController.showGameScreen();
	await roundController.startNewRound();
});

ui.pokemonIdInput.addEventListener("input", () => {
	autocomplete.renderForQuery(ui.pokemonIdInput.value);
});

ui.pokemonIdInput.addEventListener("change", () => {
	if (!autocomplete.hasExactMatch(ui.pokemonIdInput.value)) {
		return;
	}

	autocomplete.clear();
});

ui.pokemonIdInput.addEventListener("blur", () => {
	autocomplete.clear();
});

ui.pokemonIdInput.addEventListener("keydown", (event) => {
	if (event.key !== "Tab" || event.shiftKey) {
		return;
	}

	const topSuggestion = autocomplete.getTopSuggestion();
	if (!topSuggestion) {
		return;
	}

	event.preventDefault();
	ui.pokemonIdInput.value = topSuggestion;
	autocomplete.clear();
});

ui.newRoundButton.addEventListener("click", async () => {
	await roundController.startNewRound();
});

ui.guessForm.addEventListener("submit", async (event) => {
	await guessHandler.handleSubmit(event);
});

ui.giveUpButton.addEventListener("click", () => {
	if (!state.targetName || !state.targetId || state.gameOver) {
		return;
	}

	roundController.revealRoundAnswer(`Case closed. The answer was ${state.targetName} (#${state.targetId}).`);
});
