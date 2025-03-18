document.addEventListener("DOMContentLoaded", function () {
    // Extract quiz ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    let quizId = urlParams.get("id");

    if (!quizId) {
        quizId = `quiz-${Date.now()}`;
    }

    document.getElementById("quiz-id").textContent = quizId;

    // Load quiz data from localStorage
    const storedQuizzes = JSON.parse(localStorage.getItem("quizer")) || [];
    const currentQuiz = storedQuizzes.find(q => q.id == quizId);
    const questionsList = document.getElementById("questions-list");

    // Populate form fields if editing an existing quiz
    if (currentQuiz) {
        document.getElementById("quiz-title").value = currentQuiz.navn;

        currentQuiz.questions.forEach((q, index) => {
            addQuestionToForm(q.question, q.answers, q.correctAnswer, index);
        });
    }

    // Add a question
    document.getElementById("add-question").addEventListener("click", function () {
        const newIndex = document.querySelectorAll(".question-item").length;
        addQuestionToForm("", [], null, newIndex);
    });

    // Add question to form
    function addQuestionToForm(question = "", answers = [], correctAnswer = null, index) {
        const questionItem = document.createElement("div");
        questionItem.classList.add("question-item");

        questionItem.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <input type="text" class="question-input" placeholder="Enter question" value="${question}">
            <div class="answers-list">
                ${answers.map((answer, i) => `
                    <input type="text" class="answer-input" placeholder="Enter answer ${i + 1}" value="${answer}">
                    <label>
                        <input type="radio" class="correct-answer" name="correct-answer-${index}" ${i === correctAnswer ? 'checked' : ''}>
                        Correct Answer
                    </label>
                `).join('')}
            </div>
            <button type="button" class="remove-question">Remove Question</button>
        `;

        questionItem.querySelector(".remove-question").addEventListener("click", function () {
            questionItem.remove();
            saveQuiz();
        });

        questionsList.appendChild(questionItem);
    }

    // Handle form submission
    document.getElementById("quiz-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const quizTitle = document.getElementById("quiz-title").value;
        if (!quizTitle) return;

        const questions = [];
        document.querySelectorAll(".question-item").forEach((item, index) => {
            const questionText = item.querySelector(".question-input").value;
            const answers = Array.from(item.querySelectorAll(".answer-input")).map(input => input.value);
            const correctAnswerIndex = Array.from(item.querySelectorAll(".correct-answer")).findIndex(input => input.checked);

            questions.push({
                question: questionText,
                answers: answers,
                correctAnswer: correctAnswerIndex
            });
        });

        let quizer = JSON.parse(localStorage.getItem("quizer")) || [];
        let quizIndex = quizer.findIndex(q => q.id == quizId);

        if (quizIndex !== -1) {
            quizer[quizIndex].navn = quizTitle;
            quizer[quizIndex].questions = questions;
        } else {
            quizer.push({ id: quizId, navn: quizTitle, questions: questions });
        }

        localStorage.setItem("quizer", JSON.stringify(quizer));

        // Redirect back to the main page
        window.location.href = "index.html";
    });

    // Function to save quiz
    function saveQuiz() {
        // Save the quiz when changes occur (optional if auto-saving is needed)
        document.getElementById("quiz-form").dispatchEvent(new Event("submit"));
    }
});
