// Get the quiz ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("quizId");

if (quizId !== null) {
    const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const quiz = quizzes[quizId];

    if (!quiz) {
        document.body.innerHTML = "<h1>Quiz ikke funnet!</h1>";
        return;
    }

    document.getElementById("quiz-title").textContent = quiz.navn;

    let currentQuestionIndex = 0;
    const quizContainer = document.getElementById("quiz-container");
    const nextButton = document.getElementById("next-button");

    function loadQuestion() {
        quizContainer.innerHTML = "";

        const question = quiz.questions[currentQuestionIndex];
        if (!question) {
            quizContainer.innerHTML = `
                <h1>Quiz ferdig!</h1>
                <button class="back-button" onclick="tilbakeTilForside()">Tilbake til forside</button>
            `;
            nextButton.style.display = "none"; // Skjuler "Neste"-knappen når quizen er ferdig
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
            <button class="quit-button" onclick="avsluttQuiz()">Avslutt quiz</button>
        `;

        quizContainer.appendChild(questionElement);
        document.querySelectorAll(".answer-btn").forEach(btn => btn.addEventListener("click", checkAnswer));

        nextButton.style.display = "none"; // Skjuler knappen til man svarer
    }

    function checkAnswer(event) {
        let valgtSvar = event.target.dataset.index;
        let riktigSvar = quiz.questions[currentQuestionIndex].correctAnswer;

        if (valgtSvar == riktigSvar) {
            event.target.style.backgroundColor = "green";
        } else {
            event.target.style.backgroundColor = "red";
        }

        nextButton.style.display = "block"; // Viser knappen etter å ha svart
    }

    window.nesteSpørsmål = function () {
        currentQuestionIndex++;
        loadQuestion();
    };

    window.avsluttQuiz = function () {
        if (confirm("Er du sikker på at du vil avslutte?")) {
            window.location.href = "index.html";
        }
    };

    window.tilbakeTilForside = function () {
        window.location.href = "index.html";
    };

    loadQuestion();
};
