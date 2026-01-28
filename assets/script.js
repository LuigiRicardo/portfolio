const buttons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll(".section");

let currentSection = document.querySelector(".section.active") || sections[0];

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const targetId = button.dataset.section;
        const nextSection = document.getElementById(targetId);

        if (!nextSection || nextSection === currentSection) return;

        const change = () => {
            currentSection.classList.remove("active");
            nextSection.classList.add("active");
            currentSection = nextSection;

            buttons.forEach(b => b.classList.remove("active"));
            button.classList.add("active");
        };

        if (document.startViewTransition) {
            document.startViewTransition(change);
        } else {
            change();
        }
    });
});
