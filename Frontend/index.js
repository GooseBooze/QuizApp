document.addEventListener("DOMContentLoaded", visLagredeQuizer);

const API_URL = 'http://localhost:3000/api';

function leggTilObjekt() {
    // Directly navigate to create page without prompting
    window.location.href = 'create.html';
}

async function visLagredeQuizer() {
    let quizContainer = document.getElementById("quiz-list");
    quizContainer.innerHTML = "";

    try {
        const response = await fetch(`${API_URL}/quizzes`);
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        
        const quizzes = await response.json();
        console.log('Loaded quizzes:', quizzes);

        renderQuizzes(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        quizContainer.innerHTML = '<p>Kunne ikke laste quizer. Prøv igjen senere.</p>';
    }
}

function renderQuizzes(quizzes) {
    const quizContainer = document.getElementById("quiz-list");
    quizContainer.innerHTML = "";

    quizzes.forEach(quiz => {
        const quizElement = document.createElement("div");
        quizElement.className = "quiz-box";
        
        const quizContent = document.createElement("div");
        quizContent.className = "quiz-content";
        
        // Title
        const title = document.createElement("h3");
        title.textContent = quiz.navn;
        quizContent.appendChild(title);
        
        // Description (if exists)
        if (quiz.description) {
            const description = document.createElement("p");
            description.className = "quiz-description";
            description.textContent = quiz.description;
            quizContent.appendChild(description);
        }

        // Fixed-size image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'fixed-image-container';

        // Image (if exists)
        if (quiz.imageUrl) {
            const image = document.createElement('img');
            image.src = quiz.imageUrl;
            image.alt = 'Quiz preview';
            image.className = 'quiz-preview-image';
            image.style.width = '100%'; // Set fixed width
            image.style.height = '200px'; // Set fixed height
            imageContainer.appendChild(image);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'placeholder-image'; // Placeholder for no image
            imageContainer.appendChild(placeholder);
        }

        quizContent.appendChild(imageContainer);

        // Question count
        const questionCount = document.createElement("p");
        questionCount.className = "question-count";
        questionCount.textContent = `${quiz.questions.length} spørsmål`;
        quizContent.appendChild(questionCount);

        // Play button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        // Play button
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.innerHTML = '▶ Spill Quiz';
        playButton.onclick = () => window.location.href = `play.html?id=${quiz._id}`;

        // Append the button to the container
        buttonContainer.appendChild(playButton);
        quizContent.appendChild(buttonContainer);

        quizElement.appendChild(quizContent);

        // Options menu
        const optionsButton = document.createElement("button");
        optionsButton.className = "options-button";
        optionsButton.innerHTML = "⚙️";
        optionsButton.onclick = (e) => {
            e.stopPropagation();
            toggleMenu(quiz._id);
        };
        quizElement.appendChild(optionsButton);

        // Options menu content
        const menuContent = document.createElement("div");
        menuContent.className = "options-menu";
        menuContent.id = `menu-${quiz._id}`;
        menuContent.innerHTML = `
            <a href="create.html?quizId=${quiz._id}" class="menu-item">Rediger</a>
            <button onclick="slettQuiz('${quiz._id}')" class="menu-item delete">Slett</button>
        `;
        quizElement.appendChild(menuContent);

        quizContainer.appendChild(quizElement);
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.options-button')) {
        const allMenus = document.querySelectorAll('.options-menu');
        allMenus.forEach(menu => menu.style.display = 'none');
    }
});

function toggleMenu(quizId) {
    const menu = document.getElementById(`menu-${quizId}`);
    const allMenus = document.querySelectorAll('.options-menu');
    
    // Close all other menus
    allMenus.forEach(m => {
        if (m !== menu) m.style.display = 'none';
    });
    
    // Toggle this menu
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

async function slettQuiz(quizId) {
    if (!confirm('Er du sikker på at du vil slette denne quizen?')) return;

    try {
        const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete quiz');
        
        await visLagredeQuizer(); // Refresh the list
    } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Kunne ikke slette quiz. Prøv igjen senere.');
    }
}
