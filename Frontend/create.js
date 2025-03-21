document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');
    
    if (quizId) {
        // Load existing quiz data if editing
        loadQuizData(quizId);
    }
});

// Add new question input fields when clicking the button
document.getElementById("add-question").addEventListener("click", () => {
    const questionsList = document.getElementById("questions-list");
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question-item");
    questionDiv.innerHTML = `
        <input type="text" placeholder="Spørsmål" class="question-text" required>
        <div class="answers-grid">
            <input type="text" placeholder="Svar 1" class="answer" required>
            <input type="text" placeholder="Svar 2" class="answer" required>
            <input type="text" placeholder="Svar 3" class="answer" required>
            <input type="text" placeholder="Svar 4" class="answer" required>
        </div>
        <input type="number" placeholder="Riktig Svar (1-4)" min="1" max="4" class="correct-answer" required>
        <button type="button" class="remove-question btn-danger">🗑️ Fjern Spørsmål</button>
    `;
    questionsList.appendChild(questionDiv);

    // Remove question if "Remove" button is clicked
    questionDiv.querySelector(".remove-question").addEventListener("click", () => {
        questionDiv.classList.add("fade-out");
        setTimeout(() => {
            questionsList.removeChild(questionDiv);
        }, 300);
    });
});

// Save the quiz to localStorage
document.getElementById("quiz-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const quizName = document.getElementById("quiz-name").value;
    const quizDescription = document.getElementById("quiz-description").value;
    const questionItems = document.querySelectorAll(".question-item");

    const questions = Array.from(questionItems).map((item) => {
        return {
            question: item.querySelector(".question-text").value,
            answers: Array.from(item.querySelectorAll(".answer")).map(input => input.value),
            correctAnswer: parseInt(item.querySelector(".correct-answer").value)
        };
    });

    const newQuiz = {
        name: quizName,
        description: quizDescription,
        questions: questions
    };

    // Retrieve existing quizzes from localStorage or initialize an empty array
    const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    quizzes.push(newQuiz);

    // Save quizzes back to localStorage
    localStorage.setItem("quizzes", JSON.stringify(quizzes));

    // Show success message
    const successMessage = document.createElement("div");
    successMessage.textContent = "Quiz lagret!";
    successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 15px 30px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
    `;
    document.body.appendChild(successMessage);

    // Remove success message and redirect after delay
    setTimeout(() => {
        successMessage.style.opacity = "0";
        setTimeout(() => {
            window.location.href = "index.html";
        }, 300);
    }, 1500);
});
