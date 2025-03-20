// Get the quiz ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("quizId");

if (quizId !== null) {
    const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const quiz = quizzes[quizId];

    if (quiz) {
        // Display quiz name and description
        document.getElementById("quiz-details").innerHTML = `
            <h3>${quiz.name}</h3>
            <p>${quiz.description}</p>
        `;
        
        // Display the questions
        const questionsList = document.getElementById("questions-list");
        quiz.questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${question.answers.map((answer, i) => `
                    <label>
                        <input type="radio" name="question-${index}" value="${i}"> ${answer}
                    </label>
                `).join("")}
            `;
            questionsList.appendChild(questionDiv);
        });
    }
}

// Handle quiz submission (for now, we won't process answers)
document.getElementById("submit-quiz").addEventListener("click", () => {
    alert("Quiz Submitted!");
    // You can add your answer validation and score calculation here
});
