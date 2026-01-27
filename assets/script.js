const buttons = document.querySelectorAll('.sidebar button');
const sections = document.querySelectorAll('.section');

//Script responsible for handling visibility changes and navigation when buttons are clicked.
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.section;

    sections.forEach(section => {
        section.classList.remove('active');
    });

    document.getElementById(target).classList.add('active');
    });
});

buttons.forEach(btn => btn.classList.remove('active'));
button.classList.add('active');
