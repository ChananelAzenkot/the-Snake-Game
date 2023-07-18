// give a name to variables
const height = 20;
const width = 20;
let score = -1;
let timer = 20;
let timerInterval;
let isPaused = false;
const snake = [5, 4, 3, 2, 1, 0];
let head = snake[0];
let isGameOver = false;
let direction = "left";
let interval;
let random;
let lives = 3; // New variable for lives

const rightBoundaries = [];
const leftBoundaries = [];

for (let i = 0; i < height; i++) {
  rightBoundaries.push(i * width - 1);
}

for (let i = 1; i <= height; i++) {
  leftBoundaries.push(i * width);
}

//get the elements from the html
const theLiveNumber = document.querySelector(".the_live_number");
const board = document.querySelector(".board");
const btnS = document.querySelector(".keyForMobile");
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
theLiveNumber.innerHTML = `<div class="emptyBox"></div>`;
board.style.display = "none";
btnS.style.display = "none";

// create board of divs snake

function createBoard() {
  for (let i = 0; i < width * height; i++) {
    const div = document.createElement("div");
    theLiveNumber.innerHTML = `<div class="emptyBox"></div>`;
    board.style.display = "inline-grid";
    btnS.style.display = "grid";
    board.appendChild(div);
  }

  color();
  setRandom();
}
// call movement function to start the game and css for the snake
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
      clearInterval(timerInterval);
      clearInterval(interval);
      isPaused = true;
      break;
  }
});

// movement affective on snake

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
      loseLife();
      return;
    }
  } else if (dir == "left") {
    if (direction == "right") {
      return;
    }

    head++;

    if (leftBoundaries.includes(head)) {
      loseLife(); 
      return;
    }
  }

  if (snake.includes(head)) {
    loseLife(); 
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
  resumeTimer();
  startAuto();
}

// keep the snake moving by itself

function startAuto() {
  clearInterval(interval);
  interval = setInterval(() => move(direction), 100);
}

// food droop randomly on the board

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
    theLiveNumber.innerHTML = `<div class="emptyBox"></div>`;
  }
}

// game over when the snake hit the wall or itself

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

// timer for the game and the lives

function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;
    document.querySelector(
      ".timer"
    ).textContent = `The time left is - 0${minutes} : ${secondsFormatted}`;
    if (timer === 0) {
      loseLife();
      clearInterval(timerInterval);
    }
  }, 1000);
}


// continue the game after losing a life

function continueGame(){
  isGameOver = false;
  startAuto();
  startTimer();
}
const livesNumbers = document.querySelector(".the_live_number");

// losing a life

function loseLife() {
  lives--; // 
  if (lives === 0) {
    gameOver();
  } else {
    clearInterval(interval);
    clearInterval(timerInterval);
    isGameOver = true;
    theLiveNumber.innerHTML = `<div class="emptyBox"></div>`;
    livesNumbers.textContent = `You lost a life! Remaining lives - ${lives}`;
    document.querySelector(
      ".lives"
    ).textContent = `the lives left is - ${lives}`;

    const boardWidth = 20;
    const boardHeight = 20;
    const centerX = Math.floor(boardWidth / 2);
    const centerY = Math.floor(boardHeight / 2);

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
      theLiveNumber.innerHTML = `<div class="emptyBox"></div>`;
      startAuto();
      startTimer();
    }, 2000);
  }
}

// resume the timer

function resumeTimer() {
  if (!isPaused) {
    return;
  }

  // Start the timer again
  timerInterval = setInterval(() => {
    timer--;
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;
    document.querySelector(
      ".timer"
    ).textContent = `The time left is - 0${minutes} : ${secondsFormatted}`;
    if (timer === 0) {
      loseLife();
      clearInterval(timerInterval);

    }
  }, 1000);

  isPaused = false; 
}

// buttons for the game on mobile //

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
