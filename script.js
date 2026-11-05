const width = 40;
const height = 60;

let board = [];
let currentPlayer = 1;
let gameOver = false;

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const scoreEl = document.getElementById("score");
const giveUpBtn = document.getElementById("giveUpBtn");
const resetBtn = document.getElementById("resetBtn");

function initGame() {
    board = [];
    currentPlayer = 1;
    gameOver = false;
    boardEl.innerHTML = "";

    for (let r = 0; r < height; r++){
        const row = [];
        for (let c = 0; c < width; c++){
            row.push(0);
            const cellEL = document.createElement("div");
            cellEL.className = "cell";
            cellEL.dataset.r = r;
            cellEL.dataset.c = c;
            cellEL.addEventListener("click", onCellClick);
            boardEl.appendChild(cellEL);
        }
        board.push(row);
    }
    updateUI();
}

function onCellClick(e) {
    if (gameOver) return;

    const r = Number(e.target.dataset.r);
    const c = Number(e.target.dataset.c);

    if (board[r][c] !== 0) return;

    board[r][c] = currentPlayer;

     if (!hasFreeCells()) {
    endGame();
    return;
  }
    
    //gemini, model: 4 Argon
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateUI();
}

function hasFreeCells() {
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }
  return false;
}

function getScore() {
    let score1 = 0;
    let score2 = 0;
    for (let r= 0; r<height; r++){ 
        for (let c= 0; c<width; c++){
            if (board[r][c] === 1) score1++;
            if (board[r][c] === 2) score2++;
        }
    }
    return {score1, score2};
}

function updateUI() {
  const children = boardEl.children;
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const idx = r * width + c;
      const cellEl = children[idx];
      const val = board[r][c];
      cellEl.className = "cell";
      if (val === 1) cellEl.classList.add("player-1");
      if (val === 2) cellEl.classList.add("player-2");
    }
  }
  const {score1, score2} = getScore();
scoreEl.textContent = `Modrý: ${score1} | Červený: ${score2}`;

    if (!gameOver) {
        statusEl.textContent = `Na tahu: Hráč ${currentPlayer === 1 ? "Modrý" : "Červený"}`;
    }
}

function endGame() {
    gameOver = true;
    updateUI();
    const {score1, score2} = getScore();
    if (score1 > score2) {
        statusEl.textContent = "vyhrál modrý";
    } else if (score2 > score1) {
        statusEl.textContent = "vyhrál červený";
    } else {
        statusEl.textContent = "hra skončila remízou";
    }
}

giveUpBtn.addEventListener("click", () => {
  if (!gameOver) endGame();
});

resetBtn.addEventListener("click", initGame);

initGame();