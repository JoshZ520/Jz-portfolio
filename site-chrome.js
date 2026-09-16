const page = document.body.dataset;
const rootPath = page.siteRoot || "";
const currentPage = page.sitePage || "";
const displayName = "Josh Zobrist";

const navigationItems = [
	["Home", `${rootPath}index.html`, "home"],
	["Projects", `${rootPath}projects.html`, "projects"],
	["About", `${rootPath}index.html#about`, "about"],
	["Contact", `${rootPath}index.html#contact`, "contact"]
];

function createNavigation() {
	const navigation = document.createElement("nav");
	navigation.className = "site-nav";
	navigation.setAttribute("aria-label", "Main navigation");

	const logo = document.createElement("a");
	logo.className = "site-logo";
	logo.href = `${rootPath}index.html`;
	logo.textContent = displayName;
	navigation.appendChild(logo);

	const links = document.createElement("ul");
	links.className = "nav-links";

	for (const [label, href, pageName] of navigationItems) {
		const listItem = document.createElement("li");
		const link = document.createElement("a");
		link.href = href;
		link.textContent = label;

		if (currentPage === pageName) {
			link.setAttribute("aria-current", "page");
		}

		listItem.appendChild(link);
		links.appendChild(listItem);
	}

	navigation.appendChild(links);
	return navigation;
}

function renderSiteChrome() {
	const headerMount = document.querySelector("[data-site-header]");
	const footerMount = document.querySelector("[data-site-footer]");

	if (headerMount) {
		const header = document.createElement("header");
		header.className = "site-header";
		header.appendChild(createNavigation());
		headerMount.replaceWith(header);
	}

	if (footerMount) {
		const footer = document.createElement("footer");
		footer.className = "site-footer";
		const copyright = document.createElement("p");
		copyright.textContent = `(c) 2026 ${displayName}`;
		footer.appendChild(copyright);
		footerMount.replaceWith(footer);
	}
}

renderSiteChrome();
