document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('menu.html')) {
        loadMenu();
    } else if (window.location.pathname.endsWith('index.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const testFile = urlParams.get('test');
        if (testFile) {
            loadTest(testFile);
        }
    }
});

function loadMenu() {
    const menuContainer = document.getElementById('menu-container');

    // Añadir el tema 1 y sus tests
    const themeElement = document.createElement('div');
    themeElement.classList.add('theme');
    themeElement.innerHTML = `<h2>TEMA 1: La biología celular como disciplina</h2>`;
    for (let test = 1; test <= 2; test++) {
        const testElement = document.createElement('a');
        testElement.href = `index.html?test=tests/tema1_test${test}.json`;
        testElement.textContent = `Test ${test}`;
        testElement.style.display = 'block'; // Asegúrate de que se muestren como bloques
        themeElement.appendChild(testElement);
    }
    menuContainer.appendChild(themeElement);
}

function loadTest(testFile) {
    fetch(testFile)
        .then(response => response.json())
        .then(questions => {
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
        });
}
