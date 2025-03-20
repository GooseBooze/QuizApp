document.addEventListener("DOMContentLoaded", visLagredeQuizer);

function leggTilObjekt() {
    let quizNavn = prompt("Navn på quiz:");
    if (!quizNavn) return; // If no name is provided, stop the function

    let quizId = Date.now(); // Unique ID for the quiz
    let nyttQuiz = { id: quizId, navn: quizNavn, questions: [] };

    let lagredeQuizer = JSON.parse(localStorage.getItem("quizer")) || [];
    lagredeQuizer.push(nyttQuiz);
    localStorage.setItem("quizer", JSON.stringify(lagredeQuizer));

    // Display the updated list of quizzes
    visLagredeQuizer();

    // Redirect user to the create page to start building the quiz
    window.location.href = `create.html?id=${quizId}`;
}

function visLagredeQuizer() {
    let quizContainer = document.getElementById("quiz-list");
    quizContainer.innerHTML = ""; // Clear the container before updating

    let quizer = JSON.parse(localStorage.getItem("quizer")) || [];

    quizer.forEach(quiz => {
        let quizElement = document.createElement("div");
        quizElement.classList.add("quiz-container");

        let quizButton = document.createElement("button");
        quizButton.textContent = quiz.navn;
        quizButton.classList.add("quiz-button");
        quizButton.onclick = () => window.location.href = `play.html?id=${quiz.id}`; // Play quiz

        let menuButton = document.createElement("button");
        menuButton.classList.add("menu-button");
        menuButton.textContent = "⋮";
        menuButton.onclick = function (event) {
            event.stopPropagation(); // Stop event propagation to avoid triggering the quiz button's action
            toggleMenu(quiz.id);
        };

        let menuDropdown = document.createElement("div");
        menuDropdown.classList.add("menu-dropdown");
        menuDropdown.id = `menu-${quiz.id}`;

        let playButton = document.createElement("button");
        playButton.textContent = "Spill";
        playButton.onclick = () => window.location.href = `play.html?id=${quiz.id}`;

        let editButton = document.createElement("button");
        editButton.textContent = "Rediger";
        editButton.onclick = () => window.location.href = `create.html?id=${quiz.id}`;

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Slett";
        deleteButton.onclick = function () {
            slettQuiz(quiz.id);
        };

        menuDropdown.appendChild(playButton);
        menuDropdown.appendChild(editButton);
        menuDropdown.appendChild(deleteButton);

        quizElement.appendChild(quizButton);
        quizElement.appendChild(menuButton);
        quizElement.appendChild(menuDropdown);

        quizContainer.appendChild(quizElement);
    });
}

function toggleMenu(quizId) {
    let menu = document.getElementById(`menu-${quizId}`);
    let allMenus = document.querySelectorAll(".menu-dropdown");
    allMenus.forEach(m => (m.style.display = "none")); // Close all other menus
    menu.style.display = menu.style.display === "block" ? "none" : "block"; // Toggle the clicked menu
}

function slettQuiz(quizId) {
    let lagredeQuizer = JSON.parse(localStorage.getItem("quizer")) || [];
    lagredeQuizer = lagredeQuizer.filter(q => q.id !== quizId); // Remove the quiz with the matching ID
    localStorage.setItem("quizer", JSON.stringify(lagredeQuizer)); // Update the localStorage
    visLagredeQuizer(); // Re-render the list of quizzes
}
