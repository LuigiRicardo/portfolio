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
