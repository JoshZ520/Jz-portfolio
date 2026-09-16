export function createPokedexModal() {
	const modalRoot = document.getElementById("pokedex-modal");
	if (!modalRoot) {
		return null;
	}

	const closeButton = document.getElementById("close-pokedex-modal-btn");
	const title = document.getElementById("pokedex-entry-title");
	const number = document.getElementById("pokedex-entry-number");
	const sprite = document.getElementById("pokedex-entry-sprite");
	const typing = document.getElementById("pokedex-entry-typing");
	const height = document.getElementById("pokedex-entry-height");
	const weight = document.getElementById("pokedex-entry-weight");
	const abilities = document.getElementById("pokedex-entry-abilities");
	const statsList = document.getElementById("pokedex-entry-stats-list");
	const flavorText = document.getElementById("pokedex-entry-flavor-text");

	let lastFocusedElement = null;

	function renderStats(stats) {
		statsList.innerHTML = "";
		for (const stat of stats) {
			const statLine = document.createElement("p");
			statLine.textContent = `${stat.label}: ${stat.value}`;
			statsList.appendChild(statLine);
		}
	}

	function renderEntry(entryData) {
		title.textContent = entryData.name;
		number.textContent = entryData.number;
		sprite.src = entryData.spriteUrl;
		sprite.alt = entryData.spriteAlt;
		typing.textContent = entryData.typing;
		height.textContent = entryData.height;
		weight.textContent = entryData.weight;
		abilities.textContent = entryData.abilities;
		flavorText.textContent = entryData.flavorText;
		renderStats(entryData.stats || []);
	}

	function open(entryData) {
		if (!entryData) {
			return;
		}

		renderEntry(entryData);
		lastFocusedElement = document.activeElement;
		modalRoot.classList.remove("is-hidden");
		modalRoot.setAttribute("aria-hidden", "false");
		closeButton.focus();
	}

	function close(options) {
		const config = options || {};
		const restoreFocus = config.restoreFocus !== false;

		modalRoot.classList.add("is-hidden");
		modalRoot.setAttribute("aria-hidden", "true");

		if (!restoreFocus) {
			return;
		}

		if (lastFocusedElement instanceof HTMLElement && !lastFocusedElement.disabled) {
			lastFocusedElement.focus();
		}
	}

	closeButton.addEventListener("click", () => {
		close({
			restoreFocus: true
		});
	});

	return {
		open,
		close
	};
}
