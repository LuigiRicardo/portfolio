const buttons = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('.section');

//Script responsible for handling visibility changes and navigation when buttons are clicked.
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.section;
    
    buttons.forEach(btn => btn.classList.remove('active'));

    sections.forEach(section => {
        section.classList.remove('active');
    });

            button.classList.add('active');
            
    document.getElementById(target).classList.add('active');
    });
});

buttons.forEach(btn => btn.classList.remove('active'));
button.classList.add('active');
