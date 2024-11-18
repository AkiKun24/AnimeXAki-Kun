const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Fixed board size
canvas.width = 400;
canvas.height = 400;

// Game variables
const box = 20; // Size of each block
let snake = [{ x: 9 * box, y: 9 * box }];
let food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
};
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let direction = null;

// Update the displayed score and high score
function updateScore() {
    document.getElementById("scoreText").textContent = `Score: ${score}`;
    document.getElementById("highScoreText").textContent = `High Score: ${highScore}`;
}

// Draw the game
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the grid for the board
    drawGrid();

    // Draw the snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "lime" : "green";
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    // Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

// Draw grid lines for the board
function drawGrid() {
    ctx.strokeStyle = "gray";
    for (let x = 0; x < canvas.width; x += box) {
        for (let y = 0; y < canvas.height; y += box) {
            ctx.strokeRect(x, y, box, box);
        }
    }
}

// Update the game state
function update() {
    if (!direction) return;

    const head = { ...snake[0] };

    switch (direction) {
        case "UP":
            head.y -= box;
            break;
        case "DOWN":
            head.y += box;
            break;
        case "LEFT":
            head.x -= box;
            break;
        case "RIGHT":
            head.x += box;
            break;
    }

    // Check collision with walls
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height
    ) {
        gameOver();
        return;
    }

    // Check collision with self
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
        };
    } else {
        snake.pop(); // Remove the tail if no food is eaten
    }

    snake.unshift(head); // Add new head

    // Update score display
    updateScore();
}

// Game over function
function gameOver() {
    alert(`Game Over! Your score: ${score}`);
    snake = [{ x: 9 * box, y: 9 * box }];
    direction = null;
    score = 0;
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
    updateScore(); // Update score after reset
}

// Control the snake
document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            if (direction !== "DOWN") direction = "UP";
            break;
        case "ArrowDown":
            if (direction !== "UP") direction = "DOWN";
            break;
        case "ArrowLeft":
            if (direction !== "RIGHT") direction = "LEFT";
            break;
        case "ArrowRight":
            if (direction !== "LEFT") direction = "RIGHT";
            break;
    }
});

// Game loop
function gameLoop() {
    update();
    drawGame();
}

setInterval(gameLoop, 100);
