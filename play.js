document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get("id");
    const quizzes = JSON.parse(localStorage.getItem("quizer")) || [];
    const quiz = quizzes.find(q => q.id === quizId);

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
        const questionElement = document.createElement("div");
        questionElement.innerHTML = `
            <h2>${question.question}</h2>
            ${question.image ? `<img src="${question.image}" width="300">` : ""}
            <div class="answer-container">
                ${question.answers.map((answer, i) => `
                    <button class="answer-btn" data-index="${i}" style="background-color: ${["red", "blue", "yellow", "green"][i]}">${answer}</button>
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
