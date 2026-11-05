const width = 60;
const height = 40;

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
initGame();

function onCellClick(e) {
    if (gameOver) return;

    const r = Number(e.target.dataset.r);
    const c = Number(e.target.dataset.c);

    if (board[r][c] !== 0) return;

    board[r][c] = currentPlayer;
    
    //gemini, model: 4 Argon
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateUI();
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
}
