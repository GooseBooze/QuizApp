document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    let quizId = urlParams.get("id") || `quiz-${Date.now()}`;

    document.getElementById("quiz-id").textContent = quizId;

    const storedQuizzes = JSON.parse(localStorage.getItem("quizer")) || [];
    let currentQuiz = storedQuizzes.find(q => q.id == quizId);
    const questionsList = document.getElementById("questions-list");

    if (currentQuiz) {
        document.getElementById("quiz-title").value = currentQuiz.navn;
        currentQuiz.questions.forEach((q, index) => addQuestionToForm(q, index));
    } else {
        currentQuiz = { id: quizId, navn: "", questions: [] };
        storedQuizzes.push(currentQuiz);
    }

    document.getElementById("add-question").addEventListener("click", function () {
        addQuestionToForm({ question: "", answers: ["", "", "", ""], correctAnswer: null }, questionsList.children.length);
    });

    function addQuestionToForm(q, index) {
        const questionItem = document.createElement("div");
        questionItem.classList.add("question-item");

        questionItem.innerHTML = `
            <h3>Spørsmål ${index + 1}</h3>
            <input type="text" class="question-input" placeholder="Skriv inn spørsmålet" value="${q.question}">
            <input type="text" class="image-url" placeholder="Bilde-URL (valgfritt)" value="${q.image || ""}">
            <div class="answer-container">
                ${q.answers.map((answer, i) => `
                    <div class="answer color-${i}" data-index="${i}">
                        <input type="text" class="answer-input" value="${answer}" placeholder="Svar ${i + 1}">
                        <input type="radio" class="correct-answer" name="correct-answer-${index}" ${i === q.correctAnswer ? 'checked' : ''}>
                    </div>
                `).join("")}
            </div>
            <button type="button" class="remove-question">Fjern spørsmål</button>
        `;

        questionItem.querySelector(".remove-question").addEventListener("click", function () {
            questionItem.remove();
            saveQuiz();
        });

        questionItem.querySelectorAll(".correct-answer").forEach((radio, i) => {
            radio.addEventListener("change", () => {
                q.correctAnswer = i;
                saveQuiz();
            });
        });

        questionsList.appendChild(questionItem);
    }

    document.getElementById("quiz-form").addEventListener("submit", function (event) {
        event.preventDefault();
        saveQuiz();
        window.location.href = "index.html";
    });

    document.getElementById("finish-quiz").addEventListener("click", function () {
        saveQuiz();
        setTimeout(() => { 
            window.location.href = `play.html?id=${quizId}`; 
        }, 100);  // Short delay ensures saving happens first
    });

    function saveQuiz() {
        const quizTitle = document.getElementById("quiz-title").value;
        if (!quizTitle) return;

        const questions = Array.from(document.querySelectorAll(".question-item")).map((item, index) => {
            return {
                question: item.querySelector(".question-input").value,
                image: item.querySelector(".image-url").value || null,
                answers: Array.from(item.querySelectorAll(".answer-input")).map(input => input.value),
                correctAnswer: Array.from(item.querySelectorAll(".correct-answer")).findIndex(input => input.checked)
            };
        });

        let quizzes = JSON.parse(localStorage.getItem("quizer")) || [];
        let quizIndex = quizzes.findIndex(q => q.id == quizId);

        if (quizIndex !== -1) {
            quizzes[quizIndex].navn = quizTitle;
            quizzes[quizIndex].questions = questions;
        } else {
            quizzes.push({ id: quizId, navn: quizTitle, questions });
        }

        localStorage.setItem("quizer", JSON.stringify(quizzes));
    }
});
