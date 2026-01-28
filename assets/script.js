// CONFIGURAÇÕES GERAIS

const GITHUB_USER = "LuigiRicardo";
const CACHE_KEY = "github_projects_cache";
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

const buttons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll(".section");

let currentSection = document.querySelector(".section.active");

// SEGURANÇA: estado inicial

if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".observe").forEach(el => {
        el.classList.add("is-visible");
    });
}

if (!currentSection && sections.length > 0) {
    currentSection = sections[0];
    currentSection.classList.add("active");
}

// TROCA DE SEÇÕES (COM VIEW TRANSITION + FALLBACK)

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const targetId = button.dataset.section;
        const nextSection = document.getElementById(targetId);

        if (!nextSection || nextSection === currentSection) return;

        const changeSection = () => {
            
            // conteúdo
            currentSection.classList.remove("active");
            currentSection.setAttribute("hidden", "");
            currentSection.setAttribute("tabindex", "-1");

            nextSection.classList.add("active");
            nextSection.removeAttribute("hidden");
            nextSection.setAttribute("tabindex", "0");
            nextSection.focus();

            currentSection = nextSection;


            // botões
            buttons.forEach(btn => {
                btn.classList.remove("active");
                btn.setAttribute("aria-selected", "false");
            });

            button.classList.add("active");
            button.setAttribute("aria-selected", "true");

            // se for Projects, carrega GitHub
            if (targetId === "projects") {
                loadProjects();
            }

            // Reativa observação após troca de seção
            requestAnimationFrame(() => {
            observeElements();
            });
        };

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                changeSection();
            });
        } else {
            // Firefox e outros
            document.documentElement.classList.add("no-view-transition");
            changeSection();
        }
    });
});

// GITHUB API — CACHE

function getCachedProjects() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    try {
        const parsed = JSON.parse(cached);
        const expired = Date.now() - parsed.timestamp > CACHE_TTL;

        if (expired) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        return parsed.data;
    } catch {
        localStorage.removeItem(CACHE_KEY);
        return null;
    }
}

function setCachedProjects(data) {
    localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
            data,
            timestamp: Date.now()
        })
    );
}

// GITHUB API — FETCH PRINCIPAL

async function loadProjects() {
    const container = document.querySelector("#projects .projects-list");
    if (!container) return;

    container.setAttribute("aria-busy", "true");
    renderSkeleton(container);

    const cached = getCachedProjects();
    if (cached) {
        renderProjects(cached);
        container.setAttribute("aria-busy", "false");
        return;
    }

    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USER}/repos`
        );

        if (!response.ok) {
            throw new Error(response.status);
        }

        const repos = await response.json();

        setCachedProjects(repos);
        renderProjects(repos);

    } catch (error) {
        console.error("GitHub API error:", error);
        showProjectsError();
    } finally {
        container.setAttribute("aria-busy", "false");
    }
}

// RENDERIZAÇÃO

function renderSkeleton(container) {
    container.innerHTML = "";

    for (let i = 0; i < 3; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "project-skeleton";
        skeleton.setAttribute("aria-hidden", "true");
        container.appendChild(skeleton);
    }
}

function renderProjects(repos) {
    const container = document.querySelector("#projects .projects-list");
    container.innerHTML = "";

    if (!repos.length) {
        container.innerHTML = "<p>No public repositories found.</p>";
        return;
    }

    // ORDENA POR DATA DE ATUALIZAÇÃO (MAIS RECENTES PRIMEIRO)
    repos.sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
    });

    repos.forEach(repo => {
        const card = document.createElement("article");
        card.setAttribute("tabindex", "0");
        card.className = "project-card observe";

        card.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description provided."}</p>

            <div class="meta">
                ${repo.language ? `<span>${repo.language}</span>` : ""}
                <span>⭐ ${repo.stargazers_count}</span>
                <span>🍴 ${repo.forks_count}</span>
            </div>

            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                View on GitHub
            </a>
        `;

        container.appendChild(card);

        observeElements();
    });
}

function showProjectsError() {
    const container = document.querySelector("#projects .projects-list");
    container.innerHTML = `
        <p class="error" role="alert">
            Unable to load projects at the moment.
        </p>
    `;
}

// LIMPEZA DE CLASSE (fallback Firefox) 

window.addEventListener("resize", () => {
    document.documentElement.classList.remove("no-view-transition");
});

// INTERSECTION OBSERVER

const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // anima uma vez
        }
    });
}, observerOptions);

// Observa todos os elementos marcados
function observeElements() {
    const elements = document.querySelectorAll(".observe");
    elements.forEach(el => observer.observe(el));
}

// Inicial
observeElements();
