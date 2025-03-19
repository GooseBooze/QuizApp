document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = Number(urlParams.get("id"));  // Convert ID to number
    console.log("Quiz ID from URL:", quizId);

    const quizzes = JSON.parse(localStorage.getItem("quizer")) || [];
    console.log("Quizzes from localStorage:", quizzes);

    const quiz = quizzes.find(q => q.id == quizId);  // Fix ID comparison
    console.log("Matched Quiz:", quiz);

    if (!quiz) {
        document.body.innerHTML = "<h1>Quiz ikke funnet!</h1>";
        return;
    }

    document.getElementById("quiz-title").textContent = quiz.navn;

    let currentQuestionIndex = 0;
    const quizContainer = document.getElementById("quiz-container");

    function loadQuestion() {
        quizContainer.innerHTML = "";

        const question = quiz.questions[currentQuestionIndex];
        if (!question) {
            quizContainer.innerHTML = "<h1>Quiz ferdig!</h1>";
            return;
        }

        const questionElement = document.createElement("div");
        questionElement.innerHTML = `
            <h2>${question.question}</h2>
            ${question.image ? `<img src="${question.image}" width="300">` : ""}
            <div class="answer-container">
            ${question.answers.map((answer, i) => `
                <button class="answer-btn color-${i}" data-index="${i}">${answer}</button>
            `).join("")}            
            </div>
        `;

        quizContainer.appendChild(questionElement);
        document.querySelectorAll(".answer-btn").forEach(btn => btn.addEventListener("click", checkAnswer));
    }

    function checkAnswer(event) {
        alert(event.target.dataset.index == quiz.questions[currentQuestionIndex].correctAnswer ? "Riktig!" : "Feil!");
        currentQuestionIndex++;
        if (currentQuestionIndex < quiz.questions.length) {
            loadQuestion();
        } else {
            quizContainer.innerHTML = "<h1>Quiz ferdig!</h1>";
        }
    }

    loadQuestion();
});
