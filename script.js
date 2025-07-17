function Player(name, symbol) {
  this.name = name;
  this.symbol = symbol;
}

function Game(p1, p2) {
  const player1 = new Player(p1, "X");
  const player2 = new Player(p2, "O");
  let turn = player2;
  const boardHTML = document.querySelectorAll(".container div");
  const msg = document.querySelector(".display");
  let gameOver = false;
  let ct = 0;

  let GameBoard = (function () {
    let board = [];
    for (let i = 0; i < 9; i++) {
      board[i] = " ";
    }
    return board;
  })();

  function check() {
    ct++;
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (let [a, b, c] of wins) {
      if (
        GameBoard[a] !== " " &&
        GameBoard[a] === GameBoard[b] &&
        GameBoard[a] === GameBoard[c]
      ) {
        msg.textContent = `!!! WINEER IS player: ${turn.name} with ${turn.symbol} !!!`;
        gameOver = true;
        return true;
      }
    }
    if (ct === 9) {
      msg.textContent = `!!! IT'S DRAW MATCH !!!`;
      return true;
    }

    return false;
  }

  function destroy() {
    msg.textContent = "";
  }

  function displayMsg() {
    if (turn == player1) turn = player2;
    else turn = player1;
    msg.textContent = `Turn of player: ${turn.name} with ${turn.symbol}`;
  }
  displayMsg();

  function render() {
    boardHTML.forEach((e, i) => {
      e.textContent = GameBoard[i];
    });
    if (check());
    else displayMsg();
  }
  function nextMove(k) {
    if (k < 0 || k > 8 || gameOver || GameBoard[k] != " ") return;
    GameBoard[k] = turn.symbol;

    render();
  }

  function reset() {
    for (let i = 0; i < 9; i++) {
      GameBoard[i] = " ";
    }
    turn = player1;
    render();
    gameOver = false;
    ct = 0;
    displayMsg();
  }
  return { nextMove, render, reset, destroy };
}

let controls = (function () {
  let game = null;

  function handlePlaying() {
    if (game !== null) return;
    const playersName = document.querySelectorAll("#player-info input");
    playersName.forEach((element) => {
      element.readOnly = true;
    });

    game = new Game(playersName[0].value, playersName[1].value);

    const container = document.querySelector(".container");

    container.addEventListener("click", function (event) {
      const click = event.target;

      const children = Array.from(container.children);

      const index = children.indexOf(click);
      game.nextMove(index);
    });
  }
  function handleStop() {
    if (game === null) return;
    const playersName = document.querySelectorAll("#player-info input");
    playersName.forEach((element) => {
      element.readOnly = false;
    });
    game.reset();
    game.destroy();
    game = null;
  }

  function handleRestart() {
    if (game === null) return;
    game.reset();
  }
  return { handlePlaying, handleRestart, handleStop };
})();
window.handlePlaying = controls.handlePlaying;
window.handleRestart = controls.handleRestart;
window.handleStop = controls.handleStop;
