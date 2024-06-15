document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired");
    if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/App-Test/') {
        console.log("Loading menu");
        loadMenu();
    } else if (window.location.pathname.endsWith('test.html')) {
        console.log("Loading test");
        const urlParams = new URLSearchParams(window.location.search);
        const tema = urlParams.get('tema');
        console.log("Tema:", tema);
        if (tema) {
            loadTest(tema);
        } else {
            console.error("No tema specified in the URL parameters.");
        }
    } else {
        console.error("Unknown page.");
    }
});

function loadMenu() {
    console.log("Executing loadMenu");
    const menuContainer = document.getElementById('menu-container');

    const themes = [
        { title: "TEMA 1: LA BIOLOGÍA CELULAR COMO DISCIPLINA", id: "tema1" },
        { title: "TEMA 2: MÉTODOS Y TÉCNICAS EN BIOLOGÍA CELULAR", id: "tema2" },
        { title: "TEMA 3: MEMBRANAS CELULARES", id: "tema3" },
        { title: "TEMA 4: TRANSPORTE A TRAVÉS DE LAS MEMBRANAS CELULARES", id: "tema4" },
        { title: "TEMA 5: EL CITOSOL Y LOS RIBOSOMAS", id: "tema5" },
        { title: "TEMA 6: PROTEÍNAS DE ESTRÉS Y SISTEMAS CELULARES DE ELIMINACIÓN DE PROTEÍNAS", id: "tema6" },
        { title: "TEMA 7 A 9: EL CITOESQUELETO", id: "tema7a9" }
    ];

    themes.forEach(theme => {
        const themeElement = document.createElement('div');
        themeElement.classList.add('theme');
        themeElement.innerHTML = `<h2>${theme.title}</h2>`;
        for (let test = 1; test <= 10; test++) {
            const testElement = document.createElement('a');
            testElement.href = `test.html?tema=${theme.id}`;
            testElement.textContent = `Test ${test}`;
            testElement.style.display = 'block';
            themeElement.appendChild(testElement);
        }
        menuContainer.appendChild(themeElement);
    });

    console.log("Menu loaded");
}

function loadTest(tema) {
    console.log("Fetching test for tema:", tema);
    fetch(`tests/${tema}.json`)
        .then(response => {
            console.log("Response received:", response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(questions => {
            console.log("Questions loaded:", questions);
            const selectedQuestions = selectRandomQuestions(questions, 10);
            console.log("Selected questions:", selectedQuestions);
            displayQuestions(selectedQuestions);
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
            document.getElementById('quiz-container').innerHTML = '<p>No se pudo cargar el test. Por favor, inténtelo de nuevo más tarde.</p>';
        });
}

function selectRandomQuestions(questions, num) {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

function displayQuestions(questions) {
    const quizContainer = document.getElementById('quiz-container');
    const submitBtn = document.getElementById('submit-btn');
    const retryBtn = document.getElementById('retry-btn');
    const resultContainer = document.getElementById('result-container');

    quizContainer.innerHTML = '';
    questions.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `<p>${q.question}</p>`;
        
        const optionsElement = document.createElement('ul');
        optionsElement.classList.add('options');
        q.options.forEach((option, i) => {
            const optionElement = document.createElement('li');
            optionElement.innerHTML = `
                <label>
                    <input type="radio" name="question${index}" value="${i}">
                    ${option}
                </label>
            `;
            optionsElement.appendChild(optionElement);
        });
        
        questionElement.appendChild(optionsElement);
        quizContainer.appendChild(questionElement);
    });

    submitBtn.style.display = 'block';
    retryBtn.style.display = 'none';

    submitBtn.onclick = function() {
        const score = calculateResults(questions);
        resultContainer.innerHTML = `Obtuviste ${score} de ${questions.length} respuestas correctas.`;
        submitBtn.style.display = 'none';
        retryBtn.style.display = 'block';
    };

    retryBtn.onclick = function() {
        displayQuestions(selectRandomQuestions(questions, 10));
        resultContainer.innerHTML = '';
    };
}

function calculateResults(questions) {
    let score = 0;
    questions.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption && parseInt(selectedOption.value) === q.answer) {
            score++;
        }
    });
    return score;
}
