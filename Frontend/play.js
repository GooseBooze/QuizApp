// Get the quiz ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("id"); // Changed from "quizId" to "id"

if (quizId !== null) {
    let quiz = null;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    const quizContainer = document.getElementById("quiz-container");
    const nextButton = document.getElementById("next-button");
    const quitButton = document.getElementById("quit-button");

    // Add event listener for quit button
    quitButton.addEventListener("click", avsluttQuiz);

    // Fetch quiz from API
    async function loadQuiz() {
        try {
            console.log('Loading quiz with ID:', quizId);
            const response = await fetch(`http://localhost:3000/api/quizzes/${quizId}`);
            if (!response.ok) throw new Error('Quiz not found');
            quiz = await response.json();
            console.log('Loaded quiz:', quiz);
            
            document.getElementById("quiz-title").textContent = quiz.navn;
            loadQuestion();
        } catch (error) {
            console.error('Error loading quiz:', error);
            quizContainer.innerHTML = `
                <div class="error-message">
                    <h1>Quiz ikke funnet!</h1>
                </div>
            `;
        }
    }

    function loadQuestion() {
        const question = quiz.questions[currentQuestionIndex];
        console.log('Current question:', question);
        
        if (!question) {
            showQuizSummary();
            return;
        }

        // Update progress indicator
        const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
        document.querySelector('.progress-bar').style.width = `${progress}%`;
        document.querySelector('.question-counter').textContent = 
            `Spørsmål ${currentQuestionIndex + 1} av ${quiz.questions.length}`;

        quizContainer.innerHTML = `
            <div class="question-section">
                <h2 id="question-text">${question.question}</h2>
                ${question.imageUrl ? `
                    <div class="image-container">
                        <img src="${question.imageUrl}" alt="Question image" class="question-image">
                    </div>
                ` : ''}
            </div>
            <div class="answer-container">
                ${question.answers.map((answer, i) => `
                    <button class="answer-btn color-${i}" data-index="${i + 1}">
                        <span class="answer-icon">${['▲', '■', '●', '◆'][i]}</span>
                        <span class="answer-text">${answer}</span>
                    </button>
                `).join("")}
            </div>
        `;

        document.querySelectorAll(".answer-btn").forEach(btn => {
            btn.addEventListener("click", handleAnswerClick);
        });

        nextButton.style.display = "none";
    }

    function handleAnswerClick(event) {
        const selectedBtn = event.target.closest('.answer-btn');
        const selectedAnswer = parseInt(selectedBtn.dataset.index);
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const correctAnswers = currentQuestion.correctAnswers;

        document.querySelectorAll(".answer-btn").forEach(btn => {
            btn.disabled = true;
            const btnIndex = parseInt(btn.dataset.index);
            
            if (correctAnswers.includes(btnIndex)) {
                btn.classList.add('correct');
            }
            if (btnIndex === selectedAnswer && !correctAnswers.includes(btnIndex)) {
                btn.classList.add('wrong');
            }
        });

        const isCorrect = correctAnswers.includes(selectedAnswer);

        userAnswers[currentQuestionIndex] = {
            questionIndex: currentQuestionIndex,
            selectedAnswer: selectedAnswer,
            isCorrect: isCorrect
        };

        // Delay before moving to the next question
        setTimeout(() => {
            nesteSpørsmål();
        }, 4000); // 4 seconds delay
    }

    function showQuizSummary() {
        const correctCount = userAnswers.filter(answer => answer.isCorrect).length;
        const totalQuestions = quiz.questions.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);

        const correctAnswers = userAnswers.filter(answer => answer.isCorrect).map(answer => {
            const question = quiz.questions[answer.questionIndex];
            return `Spørsmål ${answer.questionIndex + 1}: ${question.question} - Riktig svar: ${question.answers[question.correctAnswers[0] - 1]}`;
        });

        quizContainer.innerHTML = `
            <div class="quiz-summary">
                <h2>Quiz Fullført!</h2>
                <div class="score-container">
                    <div class="score-circle">
                        <span class="score-text">${percentage}%</span>
                    </div>
                    <p class="score-details">Du fikk ${correctCount} av ${totalQuestions} spørsmål riktig</p>
                </div>
                <canvas id="results-chart"></canvas>
                <div id="results-summary"></div>
            </div>
        `;

        const ctx = document.getElementById('results-chart').getContext('2d');

        function displayResults(correctAnswers, totalQuestions) {
            const correctCount = correctAnswers.length;
            const wrongCount = totalQuestions - correctCount;
            const chartData = {
                labels: ['Correct', 'Wrong'],
                datasets: [{
                    data: [correctCount, wrongCount],
                    backgroundColor: ['#4CAF50', '#e21b3c'],
                }]
            };

            const resultsChart = new Chart(ctx, {
                type: 'pie',
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Quiz Results'
                        }
                    }
                }
            });

            document.getElementById('results-summary').innerHTML = '<h3>Correct Answers:</h3>' + correctAnswers.join('<br>');
        }

        displayResults(correctAnswers, totalQuestions);

        // Hide the next and quit buttons
        nextButton.style.display = "none";
        quitButton.style.display = "none";
    }

    function fadeOut(element, duration) {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = 0;
    }

    function fadeIn(element, duration) {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = 1;
    }

    function nesteSpørsmål() {
        fadeOut(quizContainer, 500); // Fade out duration 500ms
        setTimeout(() => {
            // Load the next question here
            currentQuestionIndex++;
            loadQuestion();
            fadeIn(quizContainer, 500); // Fade in duration 500ms
        }, 500); // Delay for fade out
    }

    function avsluttQuiz() {
        if (confirm('Er du sikker på at du vil avslutte quizen?')) {
            window.location.href = 'index.html';
        }
    }

    function tilbakeTilForside() {
        window.location.href = 'index.html';
    }

    // Start loading the quiz
    loadQuiz();
}
