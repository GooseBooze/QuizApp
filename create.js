// Add new question input fields when clicking the button
document.getElementById("add-question").addEventListener("click", () => {
    const questionsList = document.getElementById("questions-list");
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question-item");
    questionDiv.innerHTML = `
        <input type="text" placeholder="Spørsmål" class="question-text" required>
        <input type="text" placeholder="Svar 1" class="answer" required>
        <input type="text" placeholder="Svar 2" class="answer" required>
        <input type="text" placeholder="Svar 3" class="answer" required>
        <input type="text" placeholder="Svar 4" class="answer" required>
        <input type="number" placeholder="Riktig Svar (1-4)" class="correct-answer" required>
        <button type="button" class="remove-question">Fjern Spørsmål</button>
    `;
    questionsList.appendChild(questionDiv);

    // Remove question if "Remove" button is clicked
    questionDiv.querySelector(".remove-question").addEventListener("click", () => {
        questionsList.removeChild(questionDiv);
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
            answers: [
                item.querySelectorAll(".answer")[0].value,
                item.querySelectorAll(".answer")[1].value,
                item.querySelectorAll(".answer")[2].value,
                item.querySelectorAll(".answer")[3].value,
            ],
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

    // Redirect to the index page
    window.location.href = "index.html";
});
