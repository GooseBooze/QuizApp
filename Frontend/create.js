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

function createQuestionElement(questionData) {
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

    // Fixed-size image preview container
    const imagePreviewContainer = document.createElement('div');
    imagePreviewContainer.className = 'fixed-image-preview';
    imagePreviewContainer.style.width = '100%';
    imagePreviewContainer.style.height = 'auto'; // Allow height to adjust based on image size
    imagePreviewContainer.style.overflow = 'hidden';

    // Image element
    const imageElement = document.createElement('img');
    imageElement.className = 'quiz-preview-image';
    imageElement.id = previewId;
    imageElement.src = questionData?.imageUrl || '';
    imageElement.alt = 'Question preview';
    imageElement.style.width = '100%';
    imageElement.style.maxHeight = '250px'; // Set a maximum height for the image to be taller
    imageElement.style.objectFit = 'contain'; // Ensure the entire image is visible without cropping
    imageElement.style.borderRadius = '15px'; // Add rounded corners to the image
    if (!questionData?.imageUrl) {
        imageElement.style.display = 'none';
    }

    imagePreviewContainer.appendChild(imageElement);
    questionDiv.appendChild(questionInput);
    questionDiv.appendChild(imageUrlInput);
    questionDiv.appendChild(imagePreviewContainer);

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

    questionDiv.appendChild(answersGrid);
    questionDiv.appendChild(removeButton);

    return questionDiv;
}

function addQuestion(questionData) {
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
    e.preventDefault(); // Prevent default form submission

    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');

    const title = document.getElementById("quiz-title").value;
    const description = document.getElementById("quiz-description").value;
    const image = document.getElementById("quiz-image").value;

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
        navn: title,
        description,
        image,
        questions
    };

    try {
        const response = await fetch(`${API_URL}/quizzes${quizId ? '/' + quizId : ''}`, {
            method: quizId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quizData)
        });

        if (!response.ok) throw new Error('Failed to save quiz');

        const result = await response.json();
        console.log('Quiz saved successfully:', result);

        // Show success message
        const successMessage = document.createElement("div");
        successMessage.textContent = "Quiz saved successfully!";
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: green;
            color: white;
            padding: 15px;
            border-radius: 5px;
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
        alert('Could not save quiz. Please try again.');
    }
}
