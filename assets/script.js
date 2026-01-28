const buttons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll(".section");
const content = document.querySelector(".content");

let currentSection = document.querySelector(".section.active");

/* Detecta suporte ao View Transition */
const hasViewTransition = "startViewTransition" in document;

/* Classe para fallback */
if (!hasViewTransition) {
    document.body.classList.add("no-view-transition");
}

function switchSection(nextSection, clickedButton) {
    if (nextSection === currentSection) return;

    // Oculta atual
    currentSection.classList.remove("active");

    // Força reflow (IMPORTANTE para o snapshot)
    void content.offsetHeight;

    // Mostra próxima
    nextSection.classList.add("active");
    currentSection = nextSection;

    buttons.forEach(btn => btn.classList.remove("active"));
    clickedButton.classList.add("active");

    content.scrollTop = 0;
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const targetId = button.dataset.section;
        const nextSection = document.getElementById(targetId);

        if (!nextSection) return;

        if (hasViewTransition) {
            document.startViewTransition(() => {
                switchSection(nextSection, button);
            });
        } else {
            switchSection(nextSection, button);
        }
    });
});

/* GitHub Projects Fetch */

const projectsContainer = document.getElementById("projects-list");
const GITHUB_USER = "LuigiRicardo";
const MAX_PROJECTS = 5;

function renderSkeletons(quantity = 4) {
    projectsContainer.innerHTML = "";

    for (let i = 0; i < quantity; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "project-card skeleton";

        skeleton.innerHTML = `
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
            <div class="skeleton-meta"></div>
        `;

        projectsContainer.appendChild(skeleton);
    }
}

async function loadGitHubProjects() {
    renderSkeletons();

    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USER}/repos`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch GitHub repositories");
        }

        const repos = await response.json();

        const filteredRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, MAX_PROJECTS);

        projectsContainer.innerHTML = "";

        filteredRepos.forEach(repo => {
            const card = document.createElement("article");
            card.classList.add("project-card");

            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || "No description provided."}</p>
                <div class="project-meta">
                    <span>${repo.language || "—"}</span>
                    <a href="${repo.html_url}" target="_blank" rel="noopener">
                        View on GitHub
                    </a>
                </div>
            `;

            projectsContainer.appendChild(card);
        });

    } catch (error) {
        projectsContainer.innerHTML = `
            <p class="error">Unable to load projects at the moment.</p>
        `;
        console.error(error);
    }
}

// Executa ao abrir a aba
loadGitHubProjects();
