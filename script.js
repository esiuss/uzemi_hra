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

function onCellClick(e) {
    if (gameOver) return;

    const r = Number(e.target.dataset.r);
    const c = Number(e.target.dataset.c);

    if (board[r][c] !== 0) return;

    board[r][c] = currentPlayer;
    checkTerritories(currentPlayer);

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

/**
* AI generated
* Model: Gemini 4 Argon
 */
function checkTerritories(player) {
  const opponent = player === 1 ? 2 : 1;
  const visited = Array.from({ length: height }, () => Array(width).fill(false));
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ];

  const regions = [];
  let mainOutsideRegion = null;

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (visited[r][c] || board[r][c] === player) continue;

      const cells = [];
      const queue = [[r, c]];
      visited[r][c] = true;
      let touchesEdge = false;
      let hasOpponent = false;

      while (queue.length > 0) {
        const [cr, cc] = queue.shift();
        cells.push([cr, cc]);

        if (board[cr][cc] === opponent) {
          hasOpponent = true;
        }

        for (const [dr, dc] of dirs) {
          const nr = cr + dr;
          const nc = cc + dc;

          if (nr < 0 || nr >= height || nc < 0 || nc >= width) {
            touchesEdge = true;
          } else if (!visited[nr][nc] && board[nr][nc] !== player) {
            visited[nr][nc] = true;
            queue.push([nr, nc]);
          }
        }
      }

      const regionObj = { cells, touchesEdge, hasOpponent };
      regions.push(regionObj);

      if (touchesEdge) {
        if (!mainOutsideRegion || cells.length > mainOutsideRegion.cells.length) {
          mainOutsideRegion = regionObj;
        }
      }
    }
  }

  for (const region of regions) {
    if (region !== mainOutsideRegion && region.hasOpponent) {
      for (const [cr, cc] of region.cells) {
        board[cr][cc] = player;
      }
    }
  }
}

initGame();