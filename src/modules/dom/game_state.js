import PlayerManager from '../player_manager';

const UIGameState = (() => {
  let _currentPlayer;
  let _isStartGame = true;

  /* Game start */

  function startGame() {
    _currentPlayer = 'player';
    _toggleStartGameInterfaceVisibility();
    _disableStartGameInterface();
    _toggleBoardDescriptions();
  }

  function stopGame() {
    removeAllMoveListeners();
  }

  function showGameResult(isPlayerWinner) {
    if (isPlayerWinner) {
      _showPlayerVictory();
    } else {
      _showPlayerDefeat();
    }
  }

  function _showPlayerVictory() {
    toggleResult();
    const result = document.querySelector('.js-result');
    result.textContent = 'Victory!';
  }

  function _showPlayerDefeat() {
    toggleResult();
    const result = document.querySelector('.js-result');
    result.textContent = 'Defeat!';
  }

  function toggleResult() {
    const resultContainer = document.querySelector('.js-container--result');
    resultContainer.classList.toggle('is-visible');
  }

  /* Game restart */

  function showRestart() {
    _toggleStartGameInterfaceVisibility();
    _toggleBoardDescriptions();
  }

  /* Player and computer move */

  /* The promises are resolved once the cell is clicked */
  /* The outer module, game, will await for the promise to resolve, */
  /* And the move captured in this module will be handled */

  function playerMove(player) {
    removeAllMoveListeners();

    return new Promise((resolve, reject) => {
      _addMoveListenerForEnemyCells(resolve, '.js-cell--computer');
    });
  }

  function computerMove(computer) {
    removeAllMoveListeners();

    return new Promise((resolve, reject) => {
      _addMoveListenerForEnemyCells(resolve, '.js-cell--player');
      setTimeout(() => {
        computer.makeMove();
      }, 500);
    });
  }

  function _addMoveListenerForEnemyCells(
    promiseResolveCallback,
    enemyCellsHTMLClass,
  ) {
    const enemyCells = document.querySelectorAll(enemyCellsHTMLClass);

    enemyCells.forEach((cell) =>
      cell.addEventListener('click', (e) => {
        if (!e.target.dataset.coordinate) return;
        PlayerManager.handleGameboardAttack(e.target.dataset.coordinate);
        promiseResolveCallback();
      }),
    );
  }

  function removeAllMoveListeners() {
    const cellsWithListeners = document.querySelectorAll(
      `.js-cell--player, .js-cell--computer`,
    );

    cellsWithListeners.forEach((cell) => {
      let cellWithoutListener = cell.cloneNode(true);
      cell.parentNode.replaceChild(cellWithoutListener, cell);
    });
  }

  function toggleCurrentPlayer() {
    if (_currentPlayer === 'player') {
      _currentPlayer = 'computer';
    } else {
      _currentPlayer = 'player';
    }
  }

  function _disableStartGameInterface() {
    const buttonsWithListeners = document.querySelectorAll('.js-random, .js-start');

    buttonsWithListeners.forEach((button) => {
      let buttonWithoutListener = button.cloneNode(true);
      button.parentNode.replaceChild(buttonWithoutListener, button);
    });
  }

  function _toggleStartGameInterfaceVisibility() {
    const computerGameboard = document.querySelector('.js-computer-gameboard');
    const gameboardButtons = document.querySelectorAll('.js-random, .js-start');

    computerGameboard.classList.toggle('is-visible');
    gameboardButtons.forEach((button) => button.classList.toggle('is-visible'));
  }

  function _toggleBoardDescriptions() {
    const descriptions = document.querySelectorAll('.js-description');
    descriptions.forEach((node) => node.classList.toggle('is-visible'));
  }

  return {
    startGame,
    stopGame,
    showGameResult,
    toggleResult,
    toggleCurrentPlayer,
    playerMove,
    computerMove,
    showRestart,
    removeAllMoveListeners,
  };
})();

export default UIGameState;
