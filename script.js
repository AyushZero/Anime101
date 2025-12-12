// Quiz data - loaded from quizData.json
let quizData = null;
let clickCount = 0;

// Load quiz data from JSON file
async function loadQuizData() {
    try {
        const response = await fetch('quizData.json');
        quizData = await response.json();
        initializeStartScreen();
    } catch (error) {
        console.error('Error loading quiz data:', error);
        alert('Error loading quiz data. Please make sure quizData.json exists.');
    }
}

// Initialize start screen
function initializeStartScreen() {
    document.getElementById('quiz-title').textContent = quizData.title;
    document.getElementById('quiz-author').textContent = `Quiz by ${quizData.author}`;
    
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', handleStartClick);
}

// Handle start button click (single click to start)
function handleStartClick() {
    startGame();
}

// Start the game
function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    initializeGameBoard();
}

// Initialize the game board
function initializeGameBoard() {
    const categoriesContainer = document.getElementById('categories');
    const questionsContainer = document.getElementById('questions-grid');
    
    // Create category headers
    quizData.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.textContent = category.name;
        categoriesContainer.appendChild(categoryDiv);
    });
    
    // Create question cells (5 rows x 5 columns)
    const pointValues = [100, 200, 300, 400, 1000];
    
    pointValues.forEach(points => {
        quizData.categories.forEach((category, categoryIndex) => {
            const questionCell = document.createElement('div');
            questionCell.classList.add('question-cell');
            questionCell.textContent = points;
            questionCell.dataset.categoryIndex = categoryIndex;
            questionCell.dataset.points = points;
            
            // Add click handler (will be implemented later for showing questions)
            questionCell.addEventListener('click', () => handleQuestionClick(questionCell));
            
            questionsContainer.appendChild(questionCell);
        });
    });
}

// Track answered questions and reveal state
let answeredCount = 0;
const totalQuestions = 25;
let revealClickCount = 0;
let currentQuestion = null;

// Handle question cell click
function handleQuestionClick(cell) {
    if (cell.classList.contains('answered')) {
        return;
    }
    
    const categoryIndex = parseInt(cell.dataset.categoryIndex);
    const points = parseInt(cell.dataset.points);
    const category = quizData.categories[categoryIndex];
    const question = category.questions.find(q => q.points === points);
    
    currentQuestion = { cell, question, category: category.name, points };
    showQuestionScreen();
}

// Show question screen
function showQuestionScreen() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('question-screen').classList.remove('hidden');
    
    document.getElementById('question-category').textContent = currentQuestion.category;
    document.getElementById('question-points').textContent = currentQuestion.points;
    document.getElementById('question-text').textContent = currentQuestion.question.question || 'Question text here';
    document.getElementById('answer-text').textContent = currentQuestion.question.answer || 'Answer text here';
    
    // Reset reveal button
    const revealBtn = document.getElementById('reveal-btn');
    revealBtn.textContent = 'REVEAL ANSWER';
    revealBtn.classList.remove('confirm');
    revealBtn.onclick = handleRevealClick;
    revealClickCount = 0;
    
    // Hide answer initially
    document.getElementById('answer-container').classList.add('hidden');
}

// Handle reveal answer button (requires two clicks)
function handleRevealClick() {
    const revealBtn = document.getElementById('reveal-btn');
    const answerContainer = document.getElementById('answer-container');
    
    revealClickCount++;
    
    if (revealClickCount === 1) {
        revealBtn.textContent = 'CONFIRM REVEAL?';
        revealBtn.classList.add('confirm');
        
        setTimeout(() => {
            if (revealClickCount === 1) {
                revealBtn.textContent = 'REVEAL ANSWER';
                revealBtn.classList.remove('confirm');
                revealClickCount = 0;
            }
        }, 3000);
    } else if (revealClickCount === 2) {
        answerContainer.classList.remove('hidden');
        revealBtn.textContent = 'BACK TO BOARD';
        revealBtn.classList.remove('confirm');
        revealBtn.onclick = backToBoard;
    }
}

// Go back to board
function backToBoard() {
    currentQuestion.cell.classList.add('answered');
    answeredCount++;
    
    document.getElementById('question-screen').classList.add('hidden');
    
    // Check if all questions are answered
    if (answeredCount === totalQuestions) {
        showFinalJeopardy();
    } else {
        document.getElementById('game-screen').classList.remove('hidden');
    }
    
    currentQuestion = null;
    revealClickCount = 0;
}

// Show Final Jeopardy
function showFinalJeopardy() {
    document.getElementById('final-jeopardy-screen').classList.remove('hidden');
}

// Initialize when page loads
loadQuizData();
