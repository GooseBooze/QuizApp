// Fetch quizzes from localStorage
function fetchQuizzes() {
    const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const quizListContainer = document.getElementById("quiz-list");
    
    // Clear the quiz list first
    quizListContainer.innerHTML = "";

    if (quizzes.length > 0) {
        quizzes.forEach((quiz, index) => {
            const quizItem = document.createElement("div");
            quizItem.classList.add("quiz-item");
            quizItem.innerHTML = `
                <h3>${quiz.name}</h3>
                <p>${quiz.description}</p>
                <a href="play.html?quizId=${index}" class="btn-primary">Start Quiz</a>
            `;
            quizListContainer.appendChild(quizItem);
        });
    } else {
        quizListContainer.innerHTML = "<p>No quizzes available yet.</p>";
    }
}

// Open quiz creation page when the button is clicked
const createQuizButton = document.getElementById("create-quiz");
createQuizButton.addEventListener("click", () => {
    window.location.href = "create.html"; // Redirect to the quiz creation page
});

// Fetch quizzes when the page loads
window.onload = fetchQuizzes;
