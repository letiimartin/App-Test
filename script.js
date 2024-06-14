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
                    optionElement.innerHTML = `<input type="radio" name="question${index}" value="${i}"> ${option}`;
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
