document.addEventListener("DOMContentLoaded", visLagredeQuizer);

function leggTilObjekt() {
    let quizId = Date.now(); // Unique ID
    let quizNavn = prompt("Navn på quiz:");

    if (!quizNavn) return; // If the user cancels input

    let nyttQuiz = { id: quizId, navn: quizNavn };

    let lagredeQuizer = JSON.parse(localStorage.getItem("quizer")) || [];
    lagredeQuizer.push(nyttQuiz);
    localStorage.setItem("quizer", JSON.stringify(lagredeQuizer));

    visLagredeQuizer();
}

function visLagredeQuizer() {
    let quizContainer = document.getElementById("quiz-list");
    quizContainer.innerHTML = ""; // Clear existing list

    let quizer = JSON.parse(localStorage.getItem("quizer")) || [];

    quizer.forEach(quiz => {
        let quizElement = document.createElement("div");
        quizElement.classList.add("quiz-item");
        quizElement.textContent = quiz.navn;
        quizElement.onclick = () => window.location.href = `quiz-creation.html?id=${quiz.id}`;
        quizContainer.appendChild(quizElement);
    });
}
