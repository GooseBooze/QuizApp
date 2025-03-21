const API_URL = 'http://localhost:3000/api';

// Initialize event listeners when the DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    console.log('Loading quiz with ID:', quizId);
    
    // Add first question by default
    addQuestion();

    if (quizId) {
        // Load existing quiz data if editing
        await loadQuizData(quizId);
    }

    // Add "Back to Home" button
    const header = document.querySelector('header');
    const backButton = document.createElement('button');
    backButton.textContent = '← Tilbake til forsiden';
    backButton.classList.add('back-button');
    backButton.onclick = confirmNavigateAway;
    header.insertBefore(backButton, header.firstChild);

    // Add event listener for page unload
    window.addEventListener('beforeunload', function (e) {
        if (hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Add event listener for add question button
    document.getElementById("add-question").addEventListener("click", () => {
        addQuestion();
        hasChanges = true;
    });

    // Add event listener for form submission
    document.getElementById("quiz-form").addEventListener("submit", saveQuiz);
});

let hasChanges = false;

function hasUnsavedChanges() {
    return hasChanges;
}

function confirmNavigateAway() {
    if (!hasUnsavedChanges() || confirm('Du har ulagrede endringer. Er du sikker på at du vil forlate siden?')) {
        window.location.href = 'index.html';
    }
}

async function loadQuizData(quizId) {
    try {
        console.log('Loading quiz:', quizId);
        const response = await fetch(`${API_URL}/quizzes/${quizId}`);
        if (!response.ok) {
            console.error('Failed to load quiz:', response.status, response.statusText);
            throw new Error('Quiz not found');
        }
        const quiz = await response.json();
        console.log('Loaded quiz:', quiz);
        
        const titleInput = document.getElementById("quiz-title");
        const descInput = document.getElementById("quiz-description");
        const imageInput = document.getElementById("quiz-image");
        const questionsList = document.getElementById("questions-list");
        
        if (!titleInput || !descInput || !imageInput || !questionsList) {
            throw new Error('Required form elements not found');
        }

        titleInput.value = quiz.navn || '';
        descInput.value = quiz.description || '';
        imageInput.value = quiz.imageUrl || '';
        
        // Clear existing questions
        questionsList.innerHTML = '';
        
        // Add questions if they exist
        if (quiz.questions && Array.isArray(quiz.questions)) {
            quiz.questions.forEach(q => addQuestion(q));
        } else {
            addQuestion(); // Add one empty question by default
        }
    } catch (error) {
        console.error('Error loading quiz:', error);
        alert('Could not load quiz. Please try again.');
    }
}

function createQuestionElement(questionData = null) {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question-item";
    
    // Generate a unique ID for this question's image preview
    const previewId = 'preview-' + Math.random().toString(36).substr(2, 9);
    
    const questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.className = "question-text";
    questionInput.placeholder = "Spørsmål";
    questionInput.required = true;
    questionInput.value = questionData?.question || '';
    questionInput.oninput = () => hasChanges = true;

    const imageUrlInput = document.createElement("input");
    imageUrlInput.type = "url";
    imageUrlInput.className = "image-url";
    imageUrlInput.placeholder = "Bilde URL (valgfritt)";
    imageUrlInput.value = questionData?.imageUrl || '';
    imageUrlInput.oninput = (e) => updateImagePreview(previewId, e.target.value);

    const imagePreview = document.createElement("img");
    imagePreview.className = "image-preview";
    imagePreview.id = previewId;
    imagePreview.style.width = '100px';
    imagePreview.style.height = '100px';
    imagePreview.style.objectFit = 'cover';
    if (questionData?.imageUrl) {
        imagePreview.src = questionData.imageUrl;
        imagePreview.alt = "Question image";
        imagePreview.style.display = 'block';
    } else {
        imagePreview.style.display = 'none';
    }

    const answersGrid = document.createElement("div");
    answersGrid.className = "answers-grid";

    const answers = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < 4; i++) {
        const answerContainer = document.createElement("div");
        answerContainer.className = "answer-container";

        const answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.className = "answer answer-input";
        answerInput.placeholder = `Svar ${answers[i]}`;
        answerInput.required = true;
        answerInput.value = questionData?.answers?.[i] || '';
        answerInput.oninput = () => hasChanges = true;

        // Assign color based on the index
        const index = i;
        answerInput.style.backgroundColor = index === 0 ? '#e21b3c' : index === 1 ? '#1368ce' : index === 2 ? '#d89e00' : '#26890c';

        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = "answer-toggle";
        const checkmark = document.createElement("span");
        checkmark.textContent = "✓";
        toggleButton.appendChild(checkmark);
        toggleButton.dataset.answerIndex = (i + 1).toString();
        toggleButton.onclick = (e) => {
            e.preventDefault();
            toggleButton.classList.toggle('correct');
            answerContainer.classList.toggle('has-correct');
            hasChanges = true;
        };

        // Set initial state if this is a correct answer
        if (questionData?.correctAnswers?.includes(i + 1)) {
            toggleButton.classList.add('correct');
            answerContainer.classList.add('has-correct');
        }

        answerContainer.appendChild(answerInput);
        answerContainer.appendChild(toggleButton);
        answersGrid.appendChild(answerContainer);
    }

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-question btn-danger";
    removeButton.textContent = "🗑️ Fjern Spørsmål";
    removeButton.onclick = () => {
        if (confirm('Er du sikker på at du vil fjerne dette spørsmålet?')) {
            hasChanges = true;
            questionDiv.classList.add("fade-out");
            setTimeout(() => questionDiv.remove(), 300);
        }
    };

    questionDiv.appendChild(questionInput);
    questionDiv.appendChild(imageUrlInput);
    questionDiv.appendChild(imagePreview);
    questionDiv.appendChild(answersGrid);
    questionDiv.appendChild(removeButton);

    return questionDiv;
}

function addQuestion(questionData = null) {
    const questionsList = document.getElementById("questions-list");
    const questionElement = createQuestionElement(questionData);
    questionsList.appendChild(questionElement);
}

// Function to update image preview
function updateImagePreview(previewId, url) {
    console.log('Updating image preview with URL:', url); // Log the URL being used
    hasChanges = true;
    const preview = document.getElementById(previewId);
    if (url && url.trim() !== '') {
        preview.src = url;
        preview.alt = "Question image";
        preview.style.display = 'block';
    } else {
        preview.src = '';
        preview.alt = '';
        preview.style.display = 'none';
    }
}

// Save the quiz using the API
async function saveQuiz(e) {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    const quizName = document.getElementById("quiz-title").value;
    const questionItems = document.querySelectorAll(".question-item");

    const questions = Array.from(questionItems).map((item) => {
        const correctAnswers = Array.from(item.querySelectorAll(".answer-toggle"))
            .filter(toggle => toggle.classList.contains('correct'))
            .map(toggle => parseInt(toggle.dataset.answerIndex));

        if (correctAnswers.length === 0) {
            throw new Error('Each question must have at least one correct answer');
        }

        return {
            question: item.querySelector(".question-text").value,
            imageUrl: item.querySelector(".image-url").value,
            answers: Array.from(item.querySelectorAll(".answer-input")).map(input => input.value),
            correctAnswers: correctAnswers
        };
    });

    const quizData = {
        navn: quizName,
        description: document.getElementById("quiz-description").value,
        imageUrl: document.getElementById("quiz-image").value,
        questions: questions
    };

    try {
        console.log('Saving quiz:', quizData);
        const url = quizId 
            ? `${API_URL}/quizzes/${quizId}`  // Update existing quiz
            : `${API_URL}/quizzes`;           // Create new quiz
            
        const response = await fetch(url, {
            method: quizId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quizData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to save quiz:', response.status, response.statusText, errorText);
            throw new Error('Failed to save quiz');
        }

        const savedQuiz = await response.json();
        console.log('Quiz saved successfully:', savedQuiz);

        hasChanges = false;

        // Show success message
        const successMessage = document.createElement("div");
        successMessage.textContent = "Quiz lagret!";
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--success-color);
            color: white;
            padding: 15px 30px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 1000;
        `;
        document.body.appendChild(successMessage);

        // Remove success message after 2 seconds and redirect
        setTimeout(() => {
            successMessage.remove();
            window.location.href = "index.html";
        }, 2000);
    } catch (error) {
        console.error('Error saving quiz:', error);
        if (error.message === 'Each question must have at least one correct answer') {
            alert('Hver spørsmål må ha minst ett riktig svar.');
        } else {
            alert('Could not save quiz. Please try again.');
        }
    }
}
