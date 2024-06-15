document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired");
    if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/App-Test/') {
        console.log("Loading menu");
        loadMenu();
    } else if (window.location.pathname.endsWith('test.html')) {
        console.log("Loading test");
        const urlParams = new URLSearchParams(window.location.search);
        const testFile = urlParams.get('test');
        console.log("Test file:", testFile);
        if (testFile) {
            loadTest(testFile);
        } else {
            console.error("No test file specified in the URL parameters.");
        }
    } else {
        console.error("Unknown page.");
    }
});

function loadMenu() {
    console.log("Executing loadMenu");
    const menuContainer = document.getElementById('menu-container');

    const themes = [
        { title: "TEMA 1: LA BIOLOGÍA CELULAR COMO DISCIPLINA", base: "tema1_test" },
        { title: "TEMA 2: MÉTODOS Y TÉCNICAS EN BIOLOGÍA CELULAR", base: "tema2_test" },
        { title: "TEMA 3: MEMBRANAS CELULARES", base: "tema3_test" },
        { title: "TEMA 4: TRANSPORTE A TRAVÉS DE LAS MEMBRANAS CELULARES", base: "tema4_test" },
        { title: "TEMA 5: EL CITOSOL Y LOS RIBOSOMAS", base: "tema5_test" },
        { title: "TEMA 6: PROTEÍNAS DE ESTRÉS Y SISTEMAS CELULARES DE ELIMINACIÓN DE PROTEÍNAS", base: "tema6_test" },
        { title: "TEMA 7 A 9: EL CITOESQUELETO", base: "tema7a9_test" }
    ];

    themes.forEach(theme => {
        const themeElement = document.createElement('div');
        themeElement.classList.add('theme');
        themeElement.innerHTML = `<h2>${theme.title}</h2>`;
        for (let test = 1; test <= 10; test++) {
            const testElement = document.createElement('a');
            testElement.href = `test.html?test=tests/${theme.base}${test}.json`;
            testElement.textContent = `Test ${test}`;
            testElement.style.display = 'block';
            themeElement.appendChild(testElement);
        }
        menuContainer.appendChild(themeElement);
    });

    console.log("Menu loaded");
}

function loadTest(testFile) {
    console.log("Fetching test file:", testFile);
    fetch(testFile)
        .then(response => {
            console.log("Response received:", response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(questions => {
            console.log("Questions loaded:", questions);
            const quizContainer = document.getElementById('quiz-container');
            const submitBtn = document.getElementById('submit-btn');
            const retryBtn = document.getElementById('retry-btn');
            const resultContainer = document.getElementById('result-container');
            const testTitle = document.getElementById('test-title');

            testTitle.textContent = `Test ${testFile.split('/').pop().replace('.json', '')}`;

            function loadQuiz() {
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
            }

            function calculateResults() {
                let score = 0;
                questions.forEach((q, index) => {
                    const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
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
                        // Disable all options
                        option.disabled = true;
                    });
                    if (selectedOption && parseInt(selectedOption.value) === q.answer) {
                        score++;
                    }
                });
                return score;
            }

            function showResults() {
                const score = calculateResults();
                resultContainer.innerHTML = `Obtuviste ${score} de ${questions.length} respuestas correctas.`;
                submitBtn.style.display = 'none';
                retryBtn.style.display = 'block';
            }

            function resetQuiz() {
                loadQuiz();
                resultContainer.innerHTML = '';
                submitBtn.style.display = 'block';
                retryBtn.style.display = 'none';
            }

            submitBtn.addEventListener('click', showResults);
            retryBtn.addEventListener('click', resetQuiz);

            loadQuiz();
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
            document.getElementById('quiz-container').innerHTML = '<p>No se pudo cargar el test. Por favor, inténtelo de nuevo más tarde.</p>';
        });
}
