document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired");
    if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/App-Test/') {
        loadMenu();
    } else if (window.location.pathname.endsWith('test.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const tema = urlParams.get('tema');
        const testNumber = urlParams.get('test');
        console.log("Tema:", tema);
        if (tema && testNumber) {
            loadTest(tema, testNumber);
        } else {
            console.error("No tema or test number specified in the URL parameters.");
        }
    }
});

let usedQuestions = {}; // Variable para mantener un registro de las preguntas utilizadas

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
            testElement.href = `test.html?tema=${theme.id}&test=${test}`;
            testElement.textContent = `Test ${test}`;
            testElement.style.display = 'block';
            themeElement.appendChild(testElement);
        }
        menuContainer.appendChild(themeElement);
    });

    console.log("Menu loaded");
}

function loadTest(tema, testNumber) {
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
            if (!usedQuestions[tema]) {
                usedQuestions[tema] = [];
            }
            const selectedQuestions = selectRandomQuestions(questions, 10, tema);
            console.log("Selected questions for test " + testNumber + ":", selectedQuestions);
            displayQuestions(selectedQuestions);
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
            document.getElementById('quiz-container').innerHTML = '<p>No se pudo cargar el test. Por favor, inténtelo de nuevo más tarde.</p>';
        });
}

function selectRandomQuestions(questions, num, tema) {
    const availableQuestions = questions.filter(q => !usedQuestions[tema].includes(q.question));
    const selectedQuestions = [];

    for (let i = 0; i < num; i++) {
        if (availableQuestions.length === 0) {
            break;
        }
        const index = Math.floor(Math.random() * availableQuestions.length);
        const question = availableQuestions.splice(index, 1)[0];
        selectedQuestions.push(question);
        usedQuestions[tema].push(question.question);
    }

    return selectedQuestions;
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
        markAnswers(questions);
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

function markAnswers(questions) {
    questions.forEach((q, index) => {
        const options = document.getElementsByName(`question${index}`);
        options.forEach((option, i) => {
            const parentLabel = option.parentElement;
            if (parseInt(option.value) === q.answer) {
                parentLabel.style.color = 'green';
                parentLabel.innerHTML += ' <span>&#10003;</span>'; // Check mark
            } else if (option.checked) {
                parentLabel.style.color = 'red';
                parentLabel.innerHTML += ' <span>&#10007;</span>'; // X mark
            }
            option.disabled = true; // Disable all options
        });
    });
}
