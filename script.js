const height = 20;
const width = 20;
let score = -1;
let timer = 20;
const snake = [5, 4, 3, 2, 1, 0];
let head = snake[0];

let isGameOver = false;
let direction = "left";
let interval;
let random;
let timerInterval;
let lives = 3; // New variable for lives

const rightBoundaries = [];
const leftBoundaries = [];

for (let i = 0; i < height; i++) {
  rightBoundaries.push(i * width - 1);
}

for (let i = 1; i <= height; i++) {
  leftBoundaries.push(i * width);
}

const board = document.querySelector(".board");
const btnS = document.querySelector(".keyForMobile");
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
board.style.display = "none";
btnS.style.display = "none";

function createBoard() {
  for (let i = 0; i < width * height; i++) {
    const div = document.createElement("div");
    board.style.display = "inline-grid";
    btnS.style.display = "grid";
    board.appendChild(div);
  }

  color();
  setRandom();
}

function color() {
  const divs = board.querySelectorAll("div");

  divs.forEach((el) =>
    el.classList.remove("snake", "head", "up", "right", "down", "left")
  );

  snake.forEach((num) => divs[num].classList.add("snake"));

  divs[head].classList.add("head", direction);
}

window.addEventListener("keydown", (ev) => {
  ev.preventDefault();

  switch (ev.key) {
    case "ArrowUp":
      move("up");
      break;
    case "ArrowRight":
      move("right");
      break;
    case "ArrowDown":
      move("down");
      break;
    case "ArrowLeft":
      move("left");
      break;
    case "Escape":
      clearInterval(interval);
      break;
  }
});

function move(dir) {
  if (isGameOver) {
    return;
  }

  const divs = board.querySelectorAll("div");

  if (dir == "up") {
    if (direction == "down") {
      return;
    }

    head -= width;

    if (!divs[head]) {
      loseLife(); // New logic for losing a life
      return;
    }
  } else if (dir == "right") {
    if (direction == "left") {
      return;
    }

    head--;

    if (rightBoundaries.includes(head)) {
      loseLife(); // New logic for losing a life
      return;
    }
  } else if (dir == "down") {
    if (direction == "up") {
      return;
    }

    head += width;

    if (!divs[head]) {
      loseLife(); // New logic for losing a life
      return;
    }
  } else if (dir == "left") {
    if (direction == "right") {
      return;
    }

    head++;

    if (leftBoundaries.includes(head)) {
      loseLife(); // New logic for losing a life
      return;
    }
  }

  if (snake.includes(head)) {
    loseLife(); // New logic for losing a life
    return;
  }

  direction = dir;
  snake.unshift(head);

  if (random == head) {
    const audio = document.createElement("audio");
    audio.src = "Pebble.ogg";
    audio.volume = 0.2;
    audio.play();

    setRandom();
  } else {
    snake.pop();
  }

  color();
  startAuto();
}


function startAuto() {
  clearInterval(interval);
  interval = setInterval(() => move(direction), 200);
}

function setRandom() {
  random = Math.floor(Math.random() * (width * height));

  if (snake.includes(random)) {
    setRandom();
  } else {
    const divs = board.querySelectorAll("div");

    divs.forEach((el) => el.classList.remove("apple"));
    divs[random].classList.add("apple");
    score++;
    timer = 20;
    clearInterval(timerInterval);
    startTimer();

    document.querySelector(
      ".timer"
    ).textContent = `The time left is - 00 : ${timer}`;
    document.querySelector(".score").textContent = `
    The Score Is - ${score * 5}`;
    document.querySelector(
      ".lives"
    ).textContent = `the lives left is - ${lives}`;
  }
}

function gameOver() {
  isGameOver = true;
  clearInterval(interval);

  const audio = document.createElement("audio");
  audio.src = "Country_Blues.ogg";
  audio.volume = 0.1;
  audio.play();

  setTimeout(() => {
    alert("Game over");
    location.reload();
  }, 200);
}

function startTimer() {
  timer = 20;
  timerInterval = setInterval(() => {
    timer--;
    document.querySelector(
      ".timer"
    ).textContent = `The time left is - 00 : ${timer}`;
    if (timer == 0) {
      loseLife(); // New logic for losing a life
      clearInterval(timerInterval);
    }
  }, 1000);
}
const livesNumbers = document.querySelector(".the_live_number");

function loseLife() {
  lives--; // Decrement the number of lives
  if (lives === 0) {
    gameOver(); // If no more lives, trigger game over
  } else {
    clearInterval(interval);
    clearInterval(timerInterval);
    isGameOver = true;
    livesNumbers.textContent = `You lost a life! Remaining lives - ${lives}`;
    document.querySelector(
      ".lives"
    ).textContent = `the lives left is - ${lives}`;

    // Calculate the center position of the board
    const boardWidth = 20;
    const boardHeight = 20;
    const centerX = Math.floor(boardWidth / 2);
    const centerY = Math.floor(boardHeight / 2);

    // Move the snake to the center of the board
    const headX = Math.floor(snake[0] % boardWidth);
    const headY = Math.floor(snake[0] / boardWidth);
    const deltaX = centerX - headX;
    const deltaY = centerY - headY;
    for (let i = 0; i < snake.length; i++) {
      const x = Math.floor(snake[i] % boardWidth);
      const y = Math.floor(snake[i] / boardWidth);
      snake[i] = (y + deltaY) * boardWidth + (x + deltaX);
    }
    head = snake[0];
    direction = "left";
    color();

    setTimeout(() => {
      isGameOver = false;
      livesNumbers.textContent = "";
      startAuto();
      startTimer();
    }, 2000);
  }
}

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
  startButton.disabled = true; // Disable the button once clicked
  createBoard();
});

const upButton = document.getElementById("upButton");
upButton.addEventListener("click", () => {
  move("up");
});

const downButton = document.getElementById("downButton");
downButton.addEventListener("click", () => {
  move("down");
});

const rightButton = document.getElementById("rightButton");
rightButton.addEventListener("click", () => {
  move("right");
});

const leftButton = document.getElementById("leftButton");
leftButton.addEventListener("click", () => {
  move("left");
});

const escapeButton = document.getElementById("escape-button");

escapeButton.addEventListener("click", () => {
  clearInterval(interval);
});
