fetch('questions.json')
    .then(response => response.json())
    .then(questions => {
        const quizContainer = document.getElementById('quiz-container');
        const submitBtn = document.getElementById('submit-btn');
        const resultContainer = document.getElementById('result-container');

        function loadQuiz() {
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
        }

        submitBtn.addEventListener('click', showResults);

        loadQuiz();
    });

