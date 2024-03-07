let currentPlayer = true; // true - Player 1 (X), false - Player 2 (Computer - O)
let player1Moves = [];
let player2Moves = [];
let click = 0;
let player1Wins = false;
let player2Wins = false;

function getWinningMove(playerMoves, availableMoves) {
  const winningCombos = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["1", "5", "9"],
    ["3", "5", "7"],
    ["1", "4", "7"],
    ["2", "5", "8"],
    ["3", "6", "9"],
  ];

  for (let combo of winningCombos) {
    const missing = combo.filter((cell) => !playerMoves.includes(cell));
    if (missing.length === 1 && availableMoves.includes(missing[0])) {
      return missing[0];
    }
  }
  return null;
}

function getStrategicMove(playerMoves, availableMoves) {
  // Prioritize winning moves for the computer
  const winningMove = getWinningMove(player2Moves, availableMoves);
  if (winningMove) {
    return winningMove;
  }

  // Block player 1's winning move
  return getWinningMove(player1Moves, availableMoves);
}

function getRandomMove(availableMoves) {
  const randomIndex = getRandomInt(0, availableMoves.length - 1);
  return availableMoves[randomIndex];
}

function computerMove() {
  const availableMoves = getAvailableMoves();

  // Prioritize strategic moves (winning or blocking)
  let bestMove = getStrategicMove(player1Moves, availableMoves);

  // If no strategic move, choose a random available cell
  if (!bestMove) {
    bestMove = getRandomMove(availableMoves);
  }

  setTimeout(() => {
    const box = document.getElementById(bestMove);
    box.innerHTML = "O";
    box.classList.add("ocolor");
    player2Moves.push(bestMove);
    console.log("computer move:", bestMove);
    click++;
    console.log(click);
    // Check for winner after computer's move
    if (checkWinner(player2Moves)) {
      // Computer wins
      displayWinMessage("O");
      player2Wins = true;
    } else if (click === 9) {
      // It's a draw
      displayDrawMessage();
    } else {
      currentPlayer = true;
    }
  }, 500); // Add a delay of 500 milliseconds
}

function getAvailableMoves() {
  const allCells = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return allCells.filter(
    (cell) => !player1Moves.includes(cell) && !player2Moves.includes(cell)
  );
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function checkWinner(playerArray) {
  const winningCombos = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["1", "5", "9"],
    ["3", "5", "7"],
    ["1", "4", "7"],
    ["2", "5", "8"],
    ["3", "6", "9"],
  ];

  let winner = winningCombos.find((combo) => {
    return combo.every((cell) => playerArray.includes(cell));
  });

  if (winner) {
    highlightWinningCells(winner);
    console.log(
      "Winner:",
      playerArray === player1Moves ? "Player 1" : "Computer"
    );
    return true;
  } else {
    return false;
  }
}

function highlightWinningCells(winningCombo) {
  winningCombo.forEach((cellId) => {
    let cell = document.getElementById(cellId);
    cell.classList.add("highlight");
    setTimeout(() => {
      cell.classList.remove("highlight");
    }, 500);
  });
}

function main() {
  let boardCells = document.querySelectorAll(".box");
  boardCells.forEach((box) => {
    box.addEventListener("click", function () {
      if (currentPlayer && !player1Wins && !player2Wins) {
        click++;
        console.log(click);
        box.innerHTML = "X";
        box.classList.add("xcolor");
        player1Moves.push(this.id);
        console.log("first player array", player1Moves);

        if (checkWinner(player1Moves)) {
          // Player 1 wins
          displayWinMessage("X");
          player1Wins = true;
        } else {
          currentPlayer = false;
          computerMove();
          if (checkWinner(player2Moves)) {
            // Computer wins

            displayWinMessage("O");
            player2Wins = true;
          } else if (
            click === 9 &&
            player1Wins === false &&
            player2Wins === false
          ) {
            // It's a draw
            displayDrawMessage();
          } else {
            currentPlayer = true;
          }
        }
      }
    });
  });

  // Add a reset button (optional)
  const resetButton = document.getElementById("reset-button");
  if (resetButton) {
    resetButton.addEventListener("click", resetGame);
  }
}

function displayWinMessage(winner) {
  setTimeout(() => {
    const container = document.getElementById("container");
    container.style.display = "none";
    const win = document.getElementById("win");
    win.style.display = "flex";
    if (winner === "X") {
      win.innerText = "You win!";
    } else {
      win.innerText = "Computer wins!";
    }
  }, 500);
}

function displayDrawMessage() {
  setTimeout(() => {
    const container = document.getElementById("container");
    container.style.display = "none";
    const win = document.getElementById("win");
    win.style.display = "flex";
    win.innerText = "It's a draw!";
  }, 500);
}

main();
