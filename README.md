# Pokemon Investigation

Pokemon Investigation is an interactive guessing game and portfolio site. Players try to identify an unknown Pokemon using its Pokedex number and a series of progressive clues. Make your guesses, learn from each attempt, and see how quickly you can solve the case. Brag to your friends if you can identify the answer in fewer guesses.

## Live Site

- [Visit the portfolio](https://joshz520.github.io/Jz-portfolio/)
- [Play Pokemon Investigation](https://joshz520.github.io/Jz-portfolio/src/)

## Features

- Progressive clues that reveal more information after incorrect guesses
- Pokemon name autocomplete suggestions
- Fuzzy matching for misspelled Pokemon names
- Guess history with Pokemon names, numbers, and sprites
- Detailed Pokedex entry modal with stats, abilities, types, and field notes
- Responsive layouts for desktop and mobile screens
- Shared navigation between the portfolio and project pages
- Helpful messages for invalid names, failed requests, and network issues

## Technologies

- HTML
- CSS
- JavaScript
- Browser ES modules
- PokéAPI

This project uses plain HTML, CSS, and JavaScript without a framework or build step. The project structure keeps the portfolio pages at the repository root and the game inside the `src/` directory.

## Run Locally

Clone the repository and move into the project folder:

```bash
git clone https://github.com/JoshZ520/Jz-portfolio.git
cd Jz-portfolio
```

Start a local static server:

```bash
pnpm dlx serve .
```

Open the local URL shown in the terminal. Serving the project over HTTP is important because the game uses browser JavaScript modules and API requests. Opening the HTML files directly with a `file://` URL may prevent those features from working correctly.

## Project Structure

```text
.
├── index.html              # Portfolio homepage
├── projects.html           # Project listing page
├── portfolio.css           # Portfolio styles and color palette
├── site-chrome.js          # Shared header and footer rendering
├── assets/                 # Resume and other portfolio assets
└── src/                    # Pokemon Investigation game
	├── index.html          # Game entry point
	├── main.js             # Game application entry point
	├── styles.css          # Game stylesheet entry point
	├── css/                # Game component styles
	└── js/                 # API, game, modal, autocomplete, and utility modules
```

## API Dependency

The game retrieves Pokemon information from [PokéAPI](https://pokeapi.co/), so an internet connection is required for gameplay. A temporary API or network failure may prevent a new case from loading.

## What I Learned

This project gave me practice with organizing a larger JavaScript project into modules, working with asynchronous API requests, managing game state, building responsive layouts, and handling errors in a user-friendly way. It also helped me learn how to connect a static site to GitHub Pages and create shared page elements across multiple pages.

## Future Improvements

- Add more completed projects to the portfolio
- Add automated tests for the game logic
- Improve keyboard interaction and modal focus management
- Add additional game modes or difficulty levels
- Continue refining the portfolio design and accessibility

## Contact

- [GitHub](https://github.com/JoshZ520)
- [Portfolio](https://joshz520.github.io/Jz-portfolio/)
