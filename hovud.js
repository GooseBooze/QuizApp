document.addEventListener("DOMContentLoaded", visLagredeQuizer);

function leggTilObjekt() {
    let quizNavn = prompt("Navn på quiz:");
    if (!quizNavn) return;

    let quizId = Date.now(); // Unik ID for quizen
    let nyttQuiz = { id: quizId, navn: quizNavn, questions: [] };

    let lagredeQuizer = JSON.parse(localStorage.getItem("quizer")) || [];
    lagredeQuizer.push(nyttQuiz);
    localStorage.setItem("quizer", JSON.stringify(lagredeQuizer));

    visLagredeQuizer();

    // Send brukeren til create.html for å lage quiz
    window.location.href = `create.html?id=${quizId}`;
}

function visLagredeQuizer() {
    let quizContainer = document.getElementById("quiz-list");
    quizContainer.innerHTML = ""; // Tømmer eksisterende liste

    let quizer = JSON.parse(localStorage.getItem("quizer")) || [];

    quizer.forEach(quiz => {
        let quizElement = document.createElement("div");
        quizElement.classList.add("quiz-item");
        quizElement.textContent = quiz.navn;
        quizElement.onclick = () => window.location.href = `create.html?id=${quiz.id}`;
        quizContainer.appendChild(quizElement);
    });
}
