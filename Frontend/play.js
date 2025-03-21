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

    // Add "Back to Home" button
    const header = document.querySelector('header');
    const backButton = document.createElement('button');
    backButton.textContent = '← Tilbake til forsiden';
    backButton.classList.add('back-button');
    backButton.onclick = () => avsluttQuiz();
    header.insertBefore(backButton, header.firstChild);

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
                    <button class="back-button" onclick="tilbakeTilForside()">Tilbake til forside</button>
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
            btn.addEventListener("click", checkAnswer);
        });

        nextButton.style.display = "none";
    }

    function checkAnswer(event) {
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

        userAnswers[currentQuestionIndex] = {
            questionIndex: currentQuestionIndex,
            selectedAnswer: selectedAnswer,
            isCorrect: correctAnswers.includes(selectedAnswer)
        };

        nextButton.style.display = "block";
    }

    function showQuizSummary() {
        const correctCount = userAnswers.filter(answer => answer.isCorrect).length;
        const totalQuestions = quiz.questions.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);

        quizContainer.innerHTML = `
            <div class="quiz-summary">
                <h2>Quiz Fullført!</h2>
                <div class="score-container">
                    <div class="score-circle">
                        <span class="score-text">${percentage}%</span>
                    </div>
                    <p class="score-details">Du fikk ${correctCount} av ${totalQuestions} spørsmål riktig</p>
                </div>
                <button onclick="tilbakeTilForside()" class="back-to-home">Tilbake til forsiden</button>
            </div>
        `;

        // Hide the next and quit buttons
        nextButton.style.display = "none";
        quitButton.style.display = "none";
    }

    function nesteSpørsmål() {
        currentQuestionIndex++;
        loadQuestion();
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
