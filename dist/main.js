/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/dom/battlefield.js":
/*!****************************************!*\
  !*** ./src/modules/dom/battlefield.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clearBattlefields": () => (/* binding */ clearBattlefields),
/* harmony export */   "fillBattlefieldsWithCells": () => (/* binding */ fillBattlefieldsWithCells),
/* harmony export */   "showHitAtShip": () => (/* binding */ showHitAtShip),
/* harmony export */   "showMissedAttack": () => (/* binding */ showMissedAttack),
/* harmony export */   "showPlayerShips": () => (/* binding */ showPlayerShips),
/* harmony export */   "showShip": () => (/* binding */ showShip),
/* harmony export */   "showSunkShip": () => (/* binding */ showSunkShip)
/* harmony export */ });
/* harmony import */ var _utils_input__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/input */ "./src/modules/utils/input.js");

/* Cells generation and clearing */

function fillBattlefieldsWithCells() {
  const playerBattlefield = document.querySelector('.js-player-battlefield');
  const computerBattlefield = document.querySelector('.js-computer-battlefield');

  fillWithCells(playerBattlefield, 'js-cell--player', 'js-cell');
  fillWithCells(computerBattlefield, 'js-cell--computer', 'js-cell');
}

function fillWithCells(battlefield, ...jsClassNames) {
  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
      battlefield.appendChild(_createCell([j, i], jsClassNames));
    }
  }

  function _createCell(coordinate, jsClassNames) {
    const cell = document.createElement('div');
    cell.classList.add('gameboard__cell', ...jsClassNames);
    cell.dataset.coordinate = coordinate;

    return cell;
  }
}

function clearBattlefields() {
  const playerBattlefield = document.querySelector('.js-player-battlefield');
  const computerBattlefield = document.querySelector('.js-computer-battlefield');

  playerBattlefield.textContent = '';
  computerBattlefield.textContent = '';
}

/* Response to attack */

function showMissedAttack(coordinate, enemy) {
  const missedAttackDiv = _createAttack('missed');
  const attackedCell = document.querySelector(
    `.js-cell--${enemy}[data-coordinate="${coordinate}"]`,
  );

  if (!attackedCell) return;

  attackedCell.appendChild(missedAttackDiv);
}

function showHitAtShip(coordinate, enemy) {
  const shipAttackDiv = _createAttack('hit');
  const attackedCell = document.querySelector(
    `.js-cell--${enemy}[data-coordinate="${coordinate}"]`,
  );

  attackedCell.appendChild(shipAttackDiv);
}

function showSunkShip(coordinates, attackedPlayer) {
  if (attackedPlayer === 'computer') {
    showShip(coordinates, attackedPlayer);
  }

  setShipToSunk(coordinates, attackedPlayer);
}

function _createAttack(attackResult) {
  const div = document.createElement('div');
  div.classList.add(`gameboard__${attackResult}`);

  return div;
}

/* Ships highlighting */

function showPlayerShips() {
  const playerShipsCoordinates = _utils_input__WEBPACK_IMPORTED_MODULE_0__["default"].getPlayerShips().map((ship) =>
    ship.getCoordinates(),
  );

  playerShipsCoordinates.forEach((coordinates) => showShip(coordinates, 'player'));
}

function showShip(coordinates, player) {
  const firstCoordinate = coordinates[0];
  const cell = document.querySelector(
    `.js-cell--${player}[data-coordinate="${firstCoordinate}"]`,
  );

  const ship = document.createElement('div');
  ship.classList.add('ship', `ship--${coordinates.length}`);
  ship.dataset.length = coordinates.length;

  cell.appendChild(ship);
}

function setShipToSunk(coordinates, player) {
  const ship = document.querySelector(
    `.js-cell--${player}[data-coordinate="${coordinates[0]}"] .ship`,
  );
  ship.classList.add('ship--sunk');
}




/***/ }),

/***/ "./src/modules/dom/game_state.js":
/*!***************************************!*\
  !*** ./src/modules/dom/game_state.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _player_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../player_manager */ "./src/modules/player_manager.js");


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
        _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].handleGameboardAttack(e.target.dataset.coordinate);
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UIGameState);


/***/ }),

/***/ "./src/modules/dom/restart.js":
/*!************************************!*\
  !*** ./src/modules/dom/restart.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addRestartEvent": () => (/* binding */ addRestartEvent)
/* harmony export */ });
function addRestartEvent(callback) {
  const restartBtn = document.querySelector('.js-restart');
  restartBtn.addEventListener('click', callback);
}




/***/ }),

/***/ "./src/modules/dom/start_menu.js":
/*!***************************************!*\
  !*** ./src/modules/dom/start_menu.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addEventsToStartMenuButtons": () => (/* binding */ addEventsToStartMenuButtons)
/* harmony export */ });
function addEventsToStartMenuButtons(startCallback, randomCallback) {
  const start = document.querySelector('.js-start');
  const random = document.querySelector('.js-random');
  start.addEventListener('click', startCallback);
  random.addEventListener('click', randomCallback);
}




/***/ }),

/***/ "./src/modules/game.js":
/*!*****************************!*\
  !*** ./src/modules/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _player_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player_manager */ "./src/modules/player_manager.js");
/* harmony import */ var _utils_input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/input */ "./src/modules/utils/input.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");
/* harmony import */ var _dom_game_state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom/game_state */ "./src/modules/dom/game_state.js");
/* harmony import */ var _random_ships__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./random_ships */ "./src/modules/random_ships.js");
/* harmony import */ var _dom_battlefield__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom/battlefield */ "./src/modules/dom/battlefield.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./player */ "./src/modules/player.js");
/* harmony import */ var _utils_helper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/helper */ "./src/modules/utils/helper.js");









const Game = (() => {
  let _gameGoing = false;
  let _winner = null;
  let player = null;
  let computer = null;

  function start() {
    _initPlayers();
    _placeShips(player, computer);
    _initUI();

    _gameGoing = true;
    _gameloop();
  }

  function _stop() {
    _gameGoing = false;
    _utils_input__WEBPACK_IMPORTED_MODULE_1__["default"].clear();
  }

  function _initPlayers() {
    player = new _player__WEBPACK_IMPORTED_MODULE_6__.Player('player');
    computer = new _player__WEBPACK_IMPORTED_MODULE_6__.Computer('computer');

    _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].addPlayer(player);
    _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].addPlayer(computer);
    _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].setCurrent(player);
  }

  function _initUI() {
    _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].startGame();
  }

  async function _gameloop() {
    while (_gameGoing) {
      await nextMove();

      const attacker = _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].getCurrent();
      const attacked = _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].getNotCurrent();

      if (!attacked.gameboard.checkLastAttackSuccessful()) {
        continue;
      }

      if (!attacked.gameboard.checkLastAttackHitShip()) {
        /* If the last attack did not hit a ship */
        _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].toggleCurrent();
        _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].toggleCurrentPlayer();

        (0,_dom_battlefield__WEBPACK_IMPORTED_MODULE_5__.showMissedAttack)(attacked.gameboard.getLastAttack(), attacked.name);
      } else {
        (0,_dom_battlefield__WEBPACK_IMPORTED_MODULE_5__.showHitAtShip)(attacked.gameboard.getLastAttack(), attacked.name);
      }

      if (attacked.gameboard.checkLastAttackSankShip()) {
        const sunkShip = attacked.gameboard.getLastAttackedShip();

        _attackCellsAroundSunkShip(attacked, sunkShip);
        (0,_dom_battlefield__WEBPACK_IMPORTED_MODULE_5__.showSunkShip)(
          sunkShip.getCoordinates(),
          _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].getPlayerName(attacked),
        );
      }

      if (attacked.isGameOver()) {
        _stop();
        _winner = attacker;

        _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].stopGame();
        setTimeout(() => {
          _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].showGameResult(_winner === player ? true : false);
        }, 300);

        break;
      }
    }

    async function nextMove() {
      if (_player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].getCurrent() === player) {
        await _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].playerMove(player);
      } else if (_player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].getCurrent() === computer) {
        await _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].computerMove(computer);
      }
    }
  }

  function _placeShips(player, computer) {
    const playerShips = _utils_input__WEBPACK_IMPORTED_MODULE_1__["default"].getPlayerShips();
    const computerShips = _utils_input__WEBPACK_IMPORTED_MODULE_1__["default"].getComputerShips();

    playerShips.forEach((ship) => player.gameboard.placeShip(ship));
    computerShips.forEach((ship) => computer.gameboard.placeShip(ship));
  }

  function _attackCellsAroundSunkShip(attacked, sunkShip) {
    const cellsToAttack = (0,_utils_helper__WEBPACK_IMPORTED_MODULE_7__.getCellsSurroundingShip)(sunkShip.getCoordinates());
    cellsToAttack.forEach((cell) => {
      attacked.gameboard.receiveAttack(cell);

      if (attacked.gameboard.checkLastAttackSuccessful()) {
        (0,_dom_battlefield__WEBPACK_IMPORTED_MODULE_5__.showMissedAttack)(cell, _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].getPlayerName(attacked));
      }
    });

    _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].removeAllMoveListeners();
  }

  return {
    start,
  };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);


/***/ }),

/***/ "./src/modules/gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/gameboard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/helper */ "./src/modules/utils/helper.js");


function Gameboard() {
  const _length = 10; // 10 x 10 board
  const _ships = [];
  const _missedAttacks = [];
  const _attacks = [];

  this.getLength = function () {
    return _length;
  };

  this.getShips = function () {
    return [..._ships];
  };

  this.getMissedAttacks = function () {
    return [..._missedAttacks];
  };

  this.getAllAttacks = function () {
    return [..._attacks];
  };

  this.getPossibleAttacks = function () {
    return this.getAllCells().filter(
      (cell) => !(0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(_attacks).includes(cell.toString()),
    );
  };

  this.getLastAttack = function () {
    return _attacks[_attacks.length - 1];
  };

  this.getLastAttackedShip = function () {
    const lastAttack = this.getLastAttack();

    const lastAttackedShip = _ships.find((ship) =>
      ship
        .getCoordinates()
        .some((coordinate) => coordinate.toString() === lastAttack.toString()),
    );

    return lastAttackedShip;
  };

  this.checkLastAttackHitShip = function () {
    const lastAttack = this.getLastAttack();
    const checkResult = _ships.find((ship) =>
      (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(ship.getCoordinates()).includes(lastAttack.toString()),
    );

    return checkResult ? true : false;
  };

  this.checkLastAttackSankShip = function () {
    const lastAttack = this.getLastAttack();
    const lastShipHit = _ships.find((ship) =>
      (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(ship.getCoordinates()).includes(lastAttack.toString()),
    );

    return lastShipHit ? lastShipHit.isSunk() : false;
  };

  this.getAllCells = function () {
    const allCells = [];

    for (let i = 1; i <= _length; i++) {
      for (let j = 1; j <= _length; j++) {
        allCells.push([i, j]);
      }
    }

    return [...allCells];
  };

  function _placeMissedAttack(attackCoordinate) {
    _missedAttacks.push(attackCoordinate);
  }

  function _placeAttack(attackCoordinate) {
    _attacks.push(attackCoordinate);
  }

  function _isAttackingAlreadyAttackedCell(attackCoordinateStr) {
    for (const attack of _attacks) {
      if (attack.toString() === attackCoordinateStr) {
        return true;
      }
    }
  }

  this.placeShip = function (ship) {
    _ships.push(ship);
  };

  this.areAllShipsSunk = function () {
    return _ships.every((ship) => ship.isSunk());
  };

  let _lastAttackSuccessful;

  this.checkLastAttackSuccessful = function () {
    return _lastAttackSuccessful;
  };

  this.receiveAttack = function (attackCoordinate) {
    /* Check if it does not attack an already attacked coordinate */
    const attackCoordinateStr = attackCoordinate.toString();

    if (_isAttackingAlreadyAttackedCell(attackCoordinateStr)) {
      _lastAttackSuccessful = false;
      return;
    }

    _placeAttack(attackCoordinate);

    for (const ship of _ships) {
      for (const shipCoordinate of ship.getCoordinates()) {
        if (shipCoordinate.toString() === attackCoordinateStr) {
          // hitShip(ship, ship.getCoordinates().indexOf(shipCoordinate));
          ship.hit(ship.getCoordinates().indexOf(shipCoordinate)); // hit the ship at this position
          _lastAttackSuccessful = true;
          return;
        }
      }
    }

    _placeMissedAttack(attackCoordinate);
    _lastAttackSuccessful = true;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);


/***/ }),

/***/ "./src/modules/player.js":
/*!*******************************!*\
  !*** ./src/modules/player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Computer": () => (/* binding */ Computer),
/* harmony export */   "Player": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/modules/gameboard.js");
/* harmony import */ var _player_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player_manager */ "./src/modules/player_manager.js");
/* harmony import */ var _utils_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/helper */ "./src/modules/utils/helper.js");





class Player {
  #gameboard;
  #name;

  constructor(name) {
    this.#name = name;
    this.#gameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
    _player_manager__WEBPACK_IMPORTED_MODULE_1__["default"].addPlayer(this);
  }

  get gameboard() {
    return this.#gameboard;
  }

  get name() {
    return this.#name;
  }

  isGameOver() {
    return this.#gameboard.areAllShipsSunk();
  }
}

class Computer extends Player {
  #lastHitAtShip = null;

  #tryingToSinkShip = false; // It will try to sink a ship if it hit it

  #firstHitAtShip = null; // The very first ship's coordinate attacked

  // If the ship is attacked twice, it will determine whether the ship is horizontal or vertical
  #attackDirection = null;

  #hitsAtShip = []; // All hits at the current ship that it is trying to attack and sink
  #guessedShipPositions = []; // It will guess where the ship may be

  constructor(name) {
    super(name);
  }

  /* Getters and setters are for testing purposes only */

  get lastHitAtShip() {
    return this.#lastHitAtShip;
  }

  get tryingToSinkShip() {
    return this.#tryingToSinkShip;
  }

  set lastHitAtShip(value) {
    this.#lastHitAtShip = value;
  }

  set tryingToSinkShip(value) {
    this.#tryingToSinkShip = value;
  }

  makeMove() {
    const possibleAttacks = _player_manager__WEBPACK_IMPORTED_MODULE_1__["default"].getPlayerPossibleAttacks(this);

    if (this.#tryingToSinkShip) {
      this.currentAttack = this.#getPotentialAttackToSinkShip(possibleAttacks);
    } else {
      this.currentAttack = this.#getRandomCoordinates(possibleAttacks);
    }

    this.#attackInDOM(this.currentAttack);
    this.defineNextMove();
  }

  #getRandomCoordinates(possibleAttacks) {
    return possibleAttacks[Math.floor(Math.random() * possibleAttacks.length)];
  }

  #getPotentialAttackToSinkShip(allValidAttacks) {
    if (this.#firstHitAtShip.toString() !== this.#lastHitAtShip.toString()) {
      // if computer has already attacked a ship twice or more times,
      // define the direction in which to attack next
      this.#setAttackDirection();
      this.#guessShipPositions();

      const attacksToValidate = [...this.#guessedShipPositions];

      allValidAttacks = (0,_utils_helper__WEBPACK_IMPORTED_MODULE_2__.stringifyElements)(allValidAttacks);

      const validGuessedAttacks = attacksToValidate.filter((attack) =>
        allValidAttacks.includes(attack.toString()),
      );

      const nextAttack =
        validGuessedAttacks[Math.floor(Math.random() * validGuessedAttacks.length)];

      return nextAttack;
    } else {
      const cellsWhereMayBeShip = (0,_utils_helper__WEBPACK_IMPORTED_MODULE_2__.getPerpendicularCells)(this.#lastHitAtShip); // Where there might be a ship

      allValidAttacks = (0,_utils_helper__WEBPACK_IMPORTED_MODULE_2__.stringifyElements)(allValidAttacks);

      const validCellsWhereMayBeShip = cellsWhereMayBeShip.filter((cell) =>
        allValidAttacks.includes(cell.toString()),
      );

      return validCellsWhereMayBeShip[
        Math.floor(Math.random() * validCellsWhereMayBeShip.length)
      ];
    }
  }

  #setAttackDirection() {
    if (this.#firstHitAtShip[0] - this.#lastHitAtShip[0] === 0) {
      this.#attackDirection = 'vertical';
    }

    if (this.#firstHitAtShip[1] - this.#lastHitAtShip[1] === 0) {
      this.#attackDirection = 'horizontal';
    }
  }

  #guessShipPositions() {
    this.#hitsAtShip.forEach((hit) => {
      if (this.#attackDirection === 'vertical') {
        this.#guessedShipPositions.push(
          [Number(hit[0]), Number(hit[1]) - 1],
          [Number(hit[0]), Number(hit[1]) + 1],
        );
      }

      if (this.#attackDirection === 'horizontal') {
        this.#guessedShipPositions.push(
          [Number(hit[0]) - 1, Number(hit[1])],
          [Number(hit[0]) + 1, Number(hit[1])],
        );
      }
    });
  }

  #attackInDOM(attack) {
    document.querySelector(`.js-cell--player[data-coordinate="${attack}"]`).click();
  }

  defineNextMove() {
    if (
      _player_manager__WEBPACK_IMPORTED_MODULE_1__["default"].checkLastAttackAtEnemyHitShip() &&
      !_player_manager__WEBPACK_IMPORTED_MODULE_1__["default"].checkLastAttackAtEnemySankShip()
    ) {
      this.#defineNextMoveAsShipAttack();
    } else if (_player_manager__WEBPACK_IMPORTED_MODULE_1__["default"].checkLastAttackAtEnemySankShip()) {
      this.#defineNextMoveAsRandomAttack();
    }
  }

  #defineNextMoveAsShipAttack() {
    const lastAttack = _player_manager__WEBPACK_IMPORTED_MODULE_1__["default"].getLastAttackAtEnemy();
    if (!this.#lastHitAtShip) {
      // if it is first attack at the ship (it wasn't attacked before and last hit is falsy)
      this.#firstHitAtShip = lastAttack;
    }
    this.#tryingToSinkShip = true;
    this.#lastHitAtShip = lastAttack;
    this.#hitsAtShip.push(lastAttack);
  }

  #defineNextMoveAsRandomAttack() {
    this.#tryingToSinkShip = false;
    this.#lastHitAtShip = null;
    this.#attackDirection = null;
    this.#hitsAtShip = [];
    this.#guessedShipPositions = [];
  }
}




/***/ }),

/***/ "./src/modules/player_manager.js":
/*!***************************************!*\
  !*** ./src/modules/player_manager.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/modules/player.js");


const PlayerManager = (() => {
  let _current;
  let _players = [];

  function addPlayer(player) {
    if (_players.length === 2) {
      _players = []; // no more than two players are stored
    }
    _players.push(player);
  }

  function toggleCurrent() {
    _current = getNotCurrent();
  }

  function setCurrent(player) {
    _current = player;
  }

  function getCurrent() {
    return _current;
  }

  function getPlayerName(player) {
    // Need for DOM classes
    return player instanceof _player__WEBPACK_IMPORTED_MODULE_0__.Computer ? 'computer' : 'player';
  }

  function getNotCurrent() {
    return _current === _players[0] ? _players[1] : _players[0];
  }

  function getPlayerPossibleAttacks(player) {
    // Finds the enemy player and gets the possible attacks from their gameboard
    return _players
      .find((_player) => _player !== player)
      .gameboard.getPossibleAttacks();
  }

  function getLastAttackAtEnemy() {
    const enemy = getNotCurrent();
    return enemy.gameboard.getLastAttack();
  }

  function checkLastAttackAtEnemyHitShip() {
    const enemy = getNotCurrent();
    return enemy.gameboard.checkLastAttackHitShip();
  }

  function checkLastAttackAtEnemySankShip() {
    const enemy = getNotCurrent();
    return enemy.gameboard.checkLastAttackSankShip();
  }

  function handleGameboardAttack(coordinates) {
    if (!coordinates) return;

    const enemy = getNotCurrent();
    enemy.gameboard.receiveAttack(coordinates.split(','));
  }

  return {
    setCurrent,
    getCurrent,
    getNotCurrent,
    getPlayerName,
    toggleCurrent,
    addPlayer,
    getPlayerPossibleAttacks,
    handleGameboardAttack,
    checkLastAttackAtEnemyHitShip,
    checkLastAttackAtEnemySankShip,
    getLastAttackAtEnemy,
  };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PlayerManager);


/***/ }),

/***/ "./src/modules/random_ships.js":
/*!*************************************!*\
  !*** ./src/modules/random_ships.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "generateShipsRandomly": () => (/* binding */ generateShipsRandomly)
/* harmony export */ });
/* harmony import */ var _ship_validator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship_validator */ "./src/modules/ship_validator.js");
/* harmony import */ var _utils_input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/input */ "./src/modules/utils/input.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");





function generateShipsForBothPlayers() {
  generateShipsRandomly();
  generateShipsRandomly();
}

function generateShipsRandomly() {
  const readyShips = [];

  const carrier = getValidShip(4, readyShips);
  readyShips.push(carrier);

  for (let i = 0; i < 2; i++) {
    const battleship = getValidShip(3, readyShips);
    readyShips.push(battleship);
  }

  for (let i = 0; i < 3; i++) {
    const cruiser = getValidShip(2, readyShips);
    readyShips.push(cruiser);
  }

  for (let i = 0; i < 4; i++) {
    const patrolBoat = getValidShip(1, readyShips);
    readyShips.push(patrolBoat);
  }

  _utils_input__WEBPACK_IMPORTED_MODULE_1__["default"].placeShips(readyShips);
}

function getValidShip(shipLength, allShips) {
  while (true) {
    const generatedShip = generateShip(shipLength);

    if ((0,_ship_validator__WEBPACK_IMPORTED_MODULE_0__.validateRelativeShipPlacement)(generatedShip, allShips)) {
      return generatedShip;
    }
  }
}

function generateShip(shipLength) {
  const validCells = (0,_ship_validator__WEBPACK_IMPORTED_MODULE_0__.getValidPlacementCells)(shipLength);

  const firstCoordinate = validCells[Math.floor(Math.random() * validCells.length)];
  const coordinateX = firstCoordinate[0];
  const coordinateY = firstCoordinate[1];

  const shipCoordinates = [[...firstCoordinate]];

  for (let i = 1; i < shipLength; i++) {
    // go from the second coordinate
    shipCoordinates.push([coordinateX + i, coordinateY]);
  }

  return new _ship__WEBPACK_IMPORTED_MODULE_2__["default"](...shipCoordinates);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (generateShipsForBothPlayers);



/***/ }),

/***/ "./src/modules/ship.js":
/*!*****************************!*\
  !*** ./src/modules/ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function Ship(...coordinates) {
  /* Coordinates are ship's location on board */
  /* They are received and not created here. Look like [2, 3] */
  /* Positions are ship's inner handling of these coordinates */
  /* Positions are used when deciding where the ship is hit, */
  /* Whether or not it is sunk, and where exactly */
  /* To hit the ship in the first place */

  const _positions = _createPositions(coordinates.length);

  const _coordinates = coordinates;

  this.getCoordinates = function () {
    return [..._coordinates];
  };

  this.getPosition = function (position) {
    return _positions[position];
  };

  this.isSunk = function () {
    if (_positions.every((position) => position.isHit)) {
      return true;
    }

    return false;
  };

  /* Hit one of ship's positions */
  this.hit = function (position) {
    _positions[position].isHit = true;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);

function _createPositions(length) {
  class Position {
    constructor() {
      this.isHit = false;
    }
  }

  const positions = [];

  for (let i = 0; i < length; i++) {
    positions.push(new Position());
  }

  return positions;
}


/***/ }),

/***/ "./src/modules/ship_validator.js":
/*!***************************************!*\
  !*** ./src/modules/ship_validator.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "getValidPlacementCells": () => (/* binding */ getValidPlacementCells),
/* harmony export */   "validateRelativeShipPlacement": () => (/* binding */ validateRelativeShipPlacement)
/* harmony export */ });
/* harmony import */ var _utils_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/helper */ "./src/modules/utils/helper.js");


/* The purpose of this module is to not allow to place ships */
/* adjacent to each other and outside the gameboard. */
/* There must be some space between them */

/* First, it defines whether or not the placement is valid relative to other ships on board */
/* Second, it checks whether or not the coordinates are not outside the gameboard */

function validateShipPlacement(validatedShip, allShips) {
  const shipCoordinates = validatedShip.getCoordinates();
  const shipLength = shipCoordinates.length;
  const firstCoordinate = shipCoordinates[0];

  const isValidRelative = validateRelativeShipPlacement(validatedShip, allShips);
  const isInside = !isOutsideGameboard(shipLength, firstCoordinate);

  const isValid = isValidRelative && isInside;

  return isValid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validateShipPlacement);

function validateRelativeShipPlacement(validatedShip, allShips) {
  /* Validate against other ships */

  const shipCells = (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(validatedShip.getCoordinates());

  const adjacentShipCoordinates = (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(
    getAdjacentShipCoordinates(allShips),
  );

  if (shipCells.some((cell) => adjacentShipCoordinates.includes(cell))) {
    return false;
  }

  return true;
}

function getAdjacentShipCoordinates(allShips) {
  const adjacentShipCoordinates = allShips
    .map((ship) => {
      const shipCoordinates = ship.getCoordinates();
      return (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.getCellsSurroundingShip)(shipCoordinates);
    })
    .flat();

  allShips.forEach((ship) => {
    const shipCoordinates = ship.getCoordinates();
    shipCoordinates.forEach((coordinate) =>
      adjacentShipCoordinates.push((0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(coordinate)),
    );
  });

  return adjacentShipCoordinates;
}

function isOutsideGameboard(validatedShipLength, firstCoordinate) {
  const validCells = getValidPlacementCells(validatedShipLength);
  const isPlacementInvalid = validCells.every(
    (cell) => cell.toString() !== firstCoordinate.toString(),
  );

  if (isPlacementInvalid) {
    return true;
  } else {
    return false;
  }
}

function getValidPlacementCells(validatedShipLength) {
  const validPlacementCells = [];

  switch (validatedShipLength) {
    case 4: {
      validPlacementCells.push(...getCellsValidForShipFour());
      break;
    }
    case 3: {
      validPlacementCells.push(...getCellsValidForShipThree());
      break;
    }
    case 2: {
      validPlacementCells.push(...getCellsValidForShipTwo());
      break;
    }
    case 1: {
      validPlacementCells.push(...getAllBoard());
      break;
    }
  }

  return validPlacementCells;
}

function getCellsValidForShipFour() {
  const validCells = [];

  for (let x = 1; x <= 7; x++) {
    for (let y = 1; y <= 10; y++) {
      validCells.push([x, y]);
    }
  }

  return validCells;
}

function getCellsValidForShipThree() {
  const validCells = [];

  for (let x = 1; x <= 8; x++) {
    for (let y = 1; y <= 10; y++) {
      validCells.push([x, y]);
    }
  }

  return validCells;
}

function getCellsValidForShipTwo() {
  const validCells = [];

  for (let x = 1; x <= 9; x++) {
    for (let y = 1; y <= 10; y++) {
      validCells.push([x, y]);
    }
  }

  return validCells;
}

function getAllBoard() {
  const allBoard = [];

  for (let x = 1; x <= 10; x++) {
    for (let y = 1; y <= 10; y++) {
      allBoard.push([x, y]);
    }
  }

  return allBoard;
}




/***/ }),

/***/ "./src/modules/utils/helper.js":
/*!*************************************!*\
  !*** ./src/modules/utils/helper.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "convertElementsToNumbers": () => (/* binding */ convertElementsToNumbers),
/* harmony export */   "getCellsSurroundingCell": () => (/* binding */ getCellsSurroundingCell),
/* harmony export */   "getCellsSurroundingShip": () => (/* binding */ getCellsSurroundingShip),
/* harmony export */   "getPerpendicularCells": () => (/* binding */ getPerpendicularCells),
/* harmony export */   "stringifyElements": () => (/* binding */ stringifyElements)
/* harmony export */ });
function getCellsSurroundingCell(cell) {
  // It may return negative cells that are not on board,
  // but it doesn't matter since they are not used at all
  // All we need to check is whether we can place a ship on
  // an existing cell or not
  return [
    // return everything around this cell

    // above
    [cell[0] - 1, cell[1] - 1],
    [cell[0], cell[1] - 1],
    [cell[0] + 1, cell[1] - 1],

    // right
    [cell[0] + 1, cell[1]],
    //left
    [cell[0] - 1, cell[1]],

    // below
    [cell[0] - 1, cell[1] + 1],
    [cell[0], cell[1] + 1],
    [cell[0] + 1, cell[1] + 1],
  ];
}

function getPerpendicularCells(cell) {
  let cellAbove;
  let cellBelow;
  let cellToTheLeft;
  let cellToTheRight;
  let perpendicularCells = [];

  if (cell[1] > 1) {
    cellAbove = [Number(cell[0]), Number(cell[1]) - 1];
    perpendicularCells.push(cellAbove);
  }

  if (cell[1] < 10) {
    cellBelow = [Number(cell[0]), Number(cell[1]) + 1];
    perpendicularCells.push(cellBelow);
  }

  if (cell[0] < 10) {
    cellToTheRight = [Number(cell[0]) + 1, Number(cell[1])];
    perpendicularCells.push(cellToTheRight);
  }

  if (cell[0] > 1) {
    cellToTheLeft = [Number(cell[0]) - 1, Number(cell[1])];
    perpendicularCells.push(cellToTheLeft);
  }

  return [...perpendicularCells];
}

function stringifyElements(arr) {
  return arr.map((el) => el.toString());
}

function convertElementsToNumbers(arr) {
  return arr.map((el) => Number(el));
}

function getCellsSurroundingShip(shipCoordinates) {
  const cellsSurroundingShip = shipCoordinates.map(getCellsSurroundingCell).flat();

  return cellsSurroundingShip;
}




/***/ }),

/***/ "./src/modules/utils/input.js":
/*!************************************!*\
  !*** ./src/modules/utils/input.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./src/modules/utils/helper.js");


const Input = (() => {
  let _lastMove;
  let _ships = []; //two-dimensional.

  function setLastMove(coordinate) {
    _lastMove = (0,_helper__WEBPACK_IMPORTED_MODULE_0__.convertElementsToNumbers)(coordinate);
    console.log(_lastMove);
  }

  function getLastMove() {
    return _lastMove;
  }

  function placeShips(ships) {
    _ships.push(ships);
  }

  function getPlayerShips() {
    return _ships[0];
  }

  function getComputerShips() {
    return _ships[1];
  }

  function clear() {
    _lastMove = null;
    _ships = [];
  }

  return {
    setLastMove,
    getLastMove,
    getPlayerShips,
    getComputerShips,
    placeShips,
    clear,
  };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Input);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/dom/battlefield */ "./src/modules/dom/battlefield.js");
/* harmony import */ var _modules_dom_start_menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/dom/start_menu */ "./src/modules/dom/start_menu.js");
/* harmony import */ var _modules_dom_restart__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/dom/restart */ "./src/modules/dom/restart.js");
/* harmony import */ var _modules_dom_game_state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/dom/game_state */ "./src/modules/dom/game_state.js");
/* harmony import */ var _modules_game__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/game */ "./src/modules/game.js");
/* harmony import */ var _modules_utils_input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/utils/input */ "./src/modules/utils/input.js");
/* harmony import */ var _modules_random_ships__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/random_ships */ "./src/modules/random_ships.js");









(() => {
  initGame();
  (0,_modules_dom_restart__WEBPACK_IMPORTED_MODULE_2__.addRestartEvent)(receiveRestart);
})();

function initGame() {
  _modules_utils_input__WEBPACK_IMPORTED_MODULE_5__["default"].clear();
  /* Update battlefields */
  (0,_modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__.clearBattlefields)();
  (0,_modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__.fillBattlefieldsWithCells)();

  (0,_modules_random_ships__WEBPACK_IMPORTED_MODULE_6__["default"])();
  (0,_modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__.showPlayerShips)();

  (0,_modules_dom_start_menu__WEBPACK_IMPORTED_MODULE_1__.addEventsToStartMenuButtons)(receiveStart, receiveRandom);
}

function receiveStart() {
  _modules_game__WEBPACK_IMPORTED_MODULE_4__["default"].start();
}

function receiveRestart() {
  _modules_dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].toggleResult();
  _modules_dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].showRestart();
  initGame();
}

function receiveRandom() {
  _modules_utils_input__WEBPACK_IMPORTED_MODULE_5__["default"].clear();
  (0,_modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__.clearBattlefields)();
  (0,_modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__.fillBattlefieldsWithCells)();
  (0,_modules_random_ships__WEBPACK_IMPORTED_MODULE_6__["default"])();
  (0,_modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__.showPlayerShips)();
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVELGlFQUFlLEtBQUssRUFBQzs7Ozs7OztVQzFDckI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZtQztBQUNvQztBQUNmOztBQUVMO0FBQ2pCO0FBQ1E7QUFDdUI7O0FBRWpFO0FBQ0E7QUFDQSxFQUFFLHFFQUFlO0FBQ2pCLENBQUM7O0FBRUQ7QUFDQSxFQUFFLGtFQUFXO0FBQ2I7QUFDQSxFQUFFLDJFQUFpQjtBQUNuQixFQUFFLG1GQUF5Qjs7QUFFM0IsRUFBRSxpRUFBMkI7QUFDN0IsRUFBRSx5RUFBZTs7QUFFakIsRUFBRSxvRkFBMkI7QUFDN0I7O0FBRUE7QUFDQSxFQUFFLDJEQUFVO0FBQ1o7O0FBRUE7QUFDQSxFQUFFLDRFQUF3QjtBQUMxQixFQUFFLDJFQUF1QjtBQUN6QjtBQUNBOztBQUVBO0FBQ0EsRUFBRSxrRUFBVztBQUNiLEVBQUUsMkVBQWlCO0FBQ25CLEVBQUUsbUZBQXlCO0FBQzNCLEVBQUUsaUVBQTJCO0FBQzdCLEVBQUUseUVBQWU7QUFDakIsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9kb20vYmF0dGxlZmllbGQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2RvbS9nYW1lX3N0YXRlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9kb20vcmVzdGFydC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZG9tL3N0YXJ0X21lbnUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXJfbWFuYWdlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcmFuZG9tX3NoaXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwX3ZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvdXRpbHMvaGVscGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy91dGlscy9pbnB1dC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSW5wdXQgZnJvbSAnLi4vdXRpbHMvaW5wdXQnO1xuLyogQ2VsbHMgZ2VuZXJhdGlvbiBhbmQgY2xlYXJpbmcgKi9cblxuZnVuY3Rpb24gZmlsbEJhdHRsZWZpZWxkc1dpdGhDZWxscygpIHtcbiAgY29uc3QgcGxheWVyQmF0dGxlZmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtcGxheWVyLWJhdHRsZWZpZWxkJyk7XG4gIGNvbnN0IGNvbXB1dGVyQmF0dGxlZmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY29tcHV0ZXItYmF0dGxlZmllbGQnKTtcblxuICBmaWxsV2l0aENlbGxzKHBsYXllckJhdHRsZWZpZWxkLCAnanMtY2VsbC0tcGxheWVyJywgJ2pzLWNlbGwnKTtcbiAgZmlsbFdpdGhDZWxscyhjb21wdXRlckJhdHRsZWZpZWxkLCAnanMtY2VsbC0tY29tcHV0ZXInLCAnanMtY2VsbCcpO1xufVxuXG5mdW5jdGlvbiBmaWxsV2l0aENlbGxzKGJhdHRsZWZpZWxkLCAuLi5qc0NsYXNzTmFtZXMpIHtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTA7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAxOyBqIDw9IDEwOyBqKyspIHtcbiAgICAgIGJhdHRsZWZpZWxkLmFwcGVuZENoaWxkKF9jcmVhdGVDZWxsKFtqLCBpXSwganNDbGFzc05hbWVzKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2NyZWF0ZUNlbGwoY29vcmRpbmF0ZSwganNDbGFzc05hbWVzKSB7XG4gICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnZ2FtZWJvYXJkX19jZWxsJywgLi4uanNDbGFzc05hbWVzKTtcbiAgICBjZWxsLmRhdGFzZXQuY29vcmRpbmF0ZSA9IGNvb3JkaW5hdGU7XG5cbiAgICByZXR1cm4gY2VsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBjbGVhckJhdHRsZWZpZWxkcygpIHtcbiAgY29uc3QgcGxheWVyQmF0dGxlZmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtcGxheWVyLWJhdHRsZWZpZWxkJyk7XG4gIGNvbnN0IGNvbXB1dGVyQmF0dGxlZmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY29tcHV0ZXItYmF0dGxlZmllbGQnKTtcblxuICBwbGF5ZXJCYXR0bGVmaWVsZC50ZXh0Q29udGVudCA9ICcnO1xuICBjb21wdXRlckJhdHRsZWZpZWxkLnRleHRDb250ZW50ID0gJyc7XG59XG5cbi8qIFJlc3BvbnNlIHRvIGF0dGFjayAqL1xuXG5mdW5jdGlvbiBzaG93TWlzc2VkQXR0YWNrKGNvb3JkaW5hdGUsIGVuZW15KSB7XG4gIGNvbnN0IG1pc3NlZEF0dGFja0RpdiA9IF9jcmVhdGVBdHRhY2soJ21pc3NlZCcpO1xuICBjb25zdCBhdHRhY2tlZENlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIGAuanMtY2VsbC0tJHtlbmVteX1bZGF0YS1jb29yZGluYXRlPVwiJHtjb29yZGluYXRlfVwiXWAsXG4gICk7XG5cbiAgaWYgKCFhdHRhY2tlZENlbGwpIHJldHVybjtcblxuICBhdHRhY2tlZENlbGwuYXBwZW5kQ2hpbGQobWlzc2VkQXR0YWNrRGl2KTtcbn1cblxuZnVuY3Rpb24gc2hvd0hpdEF0U2hpcChjb29yZGluYXRlLCBlbmVteSkge1xuICBjb25zdCBzaGlwQXR0YWNrRGl2ID0gX2NyZWF0ZUF0dGFjaygnaGl0Jyk7XG4gIGNvbnN0IGF0dGFja2VkQ2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgYC5qcy1jZWxsLS0ke2VuZW15fVtkYXRhLWNvb3JkaW5hdGU9XCIke2Nvb3JkaW5hdGV9XCJdYCxcbiAgKTtcblxuICBhdHRhY2tlZENlbGwuYXBwZW5kQ2hpbGQoc2hpcEF0dGFja0Rpdik7XG59XG5cbmZ1bmN0aW9uIHNob3dTdW5rU2hpcChjb29yZGluYXRlcywgYXR0YWNrZWRQbGF5ZXIpIHtcbiAgaWYgKGF0dGFja2VkUGxheWVyID09PSAnY29tcHV0ZXInKSB7XG4gICAgc2hvd1NoaXAoY29vcmRpbmF0ZXMsIGF0dGFja2VkUGxheWVyKTtcbiAgfVxuXG4gIHNldFNoaXBUb1N1bmsoY29vcmRpbmF0ZXMsIGF0dGFja2VkUGxheWVyKTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUF0dGFjayhhdHRhY2tSZXN1bHQpIHtcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5jbGFzc0xpc3QuYWRkKGBnYW1lYm9hcmRfXyR7YXR0YWNrUmVzdWx0fWApO1xuXG4gIHJldHVybiBkaXY7XG59XG5cbi8qIFNoaXBzIGhpZ2hsaWdodGluZyAqL1xuXG5mdW5jdGlvbiBzaG93UGxheWVyU2hpcHMoKSB7XG4gIGNvbnN0IHBsYXllclNoaXBzQ29vcmRpbmF0ZXMgPSBJbnB1dC5nZXRQbGF5ZXJTaGlwcygpLm1hcCgoc2hpcCkgPT5cbiAgICBzaGlwLmdldENvb3JkaW5hdGVzKCksXG4gICk7XG5cbiAgcGxheWVyU2hpcHNDb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlcykgPT4gc2hvd1NoaXAoY29vcmRpbmF0ZXMsICdwbGF5ZXInKSk7XG59XG5cbmZ1bmN0aW9uIHNob3dTaGlwKGNvb3JkaW5hdGVzLCBwbGF5ZXIpIHtcbiAgY29uc3QgZmlyc3RDb29yZGluYXRlID0gY29vcmRpbmF0ZXNbMF07XG4gIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIGAuanMtY2VsbC0tJHtwbGF5ZXJ9W2RhdGEtY29vcmRpbmF0ZT1cIiR7Zmlyc3RDb29yZGluYXRlfVwiXWAsXG4gICk7XG5cbiAgY29uc3Qgc2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3NoaXAnLCBgc2hpcC0tJHtjb29yZGluYXRlcy5sZW5ndGh9YCk7XG4gIHNoaXAuZGF0YXNldC5sZW5ndGggPSBjb29yZGluYXRlcy5sZW5ndGg7XG5cbiAgY2VsbC5hcHBlbmRDaGlsZChzaGlwKTtcbn1cblxuZnVuY3Rpb24gc2V0U2hpcFRvU3Vuayhjb29yZGluYXRlcywgcGxheWVyKSB7XG4gIGNvbnN0IHNoaXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIGAuanMtY2VsbC0tJHtwbGF5ZXJ9W2RhdGEtY29vcmRpbmF0ZT1cIiR7Y29vcmRpbmF0ZXNbMF19XCJdIC5zaGlwYCxcbiAgKTtcbiAgc2hpcC5jbGFzc0xpc3QuYWRkKCdzaGlwLS1zdW5rJyk7XG59XG5cbmV4cG9ydCB7XG4gIGZpbGxCYXR0bGVmaWVsZHNXaXRoQ2VsbHMsXG4gIGNsZWFyQmF0dGxlZmllbGRzLFxuICBzaG93TWlzc2VkQXR0YWNrLFxuICBzaG93SGl0QXRTaGlwLFxuICBzaG93U3Vua1NoaXAsXG4gIHNob3dQbGF5ZXJTaGlwcyxcbiAgc2hvd1NoaXAsXG59O1xuIiwiaW1wb3J0IFBsYXllck1hbmFnZXIgZnJvbSAnLi4vcGxheWVyX21hbmFnZXInO1xuXG5jb25zdCBVSUdhbWVTdGF0ZSA9ICgoKSA9PiB7XG4gIGxldCBfY3VycmVudFBsYXllcjtcbiAgbGV0IF9pc1N0YXJ0R2FtZSA9IHRydWU7XG5cbiAgLyogR2FtZSBzdGFydCAqL1xuXG4gIGZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcbiAgICBfY3VycmVudFBsYXllciA9ICdwbGF5ZXInO1xuICAgIF90b2dnbGVTdGFydEdhbWVJbnRlcmZhY2VWaXNpYmlsaXR5KCk7XG4gICAgX2Rpc2FibGVTdGFydEdhbWVJbnRlcmZhY2UoKTtcbiAgICBfdG9nZ2xlQm9hcmREZXNjcmlwdGlvbnMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BHYW1lKCkge1xuICAgIHJlbW92ZUFsbE1vdmVMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dHYW1lUmVzdWx0KGlzUGxheWVyV2lubmVyKSB7XG4gICAgaWYgKGlzUGxheWVyV2lubmVyKSB7XG4gICAgICBfc2hvd1BsYXllclZpY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX3Nob3dQbGF5ZXJEZWZlYXQoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfc2hvd1BsYXllclZpY3RvcnkoKSB7XG4gICAgdG9nZ2xlUmVzdWx0KCk7XG4gICAgY29uc3QgcmVzdWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXJlc3VsdCcpO1xuICAgIHJlc3VsdC50ZXh0Q29udGVudCA9ICdWaWN0b3J5ISc7XG4gIH1cblxuICBmdW5jdGlvbiBfc2hvd1BsYXllckRlZmVhdCgpIHtcbiAgICB0b2dnbGVSZXN1bHQoKTtcbiAgICBjb25zdCByZXN1bHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtcmVzdWx0Jyk7XG4gICAgcmVzdWx0LnRleHRDb250ZW50ID0gJ0RlZmVhdCEnO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlUmVzdWx0KCkge1xuICAgIGNvbnN0IHJlc3VsdENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1jb250YWluZXItLXJlc3VsdCcpO1xuICAgIHJlc3VsdENvbnRhaW5lci5jbGFzc0xpc3QudG9nZ2xlKCdpcy12aXNpYmxlJyk7XG4gIH1cblxuICAvKiBHYW1lIHJlc3RhcnQgKi9cblxuICBmdW5jdGlvbiBzaG93UmVzdGFydCgpIHtcbiAgICBfdG9nZ2xlU3RhcnRHYW1lSW50ZXJmYWNlVmlzaWJpbGl0eSgpO1xuICAgIF90b2dnbGVCb2FyZERlc2NyaXB0aW9ucygpO1xuICB9XG5cbiAgLyogUGxheWVyIGFuZCBjb21wdXRlciBtb3ZlICovXG5cbiAgLyogVGhlIHByb21pc2VzIGFyZSByZXNvbHZlZCBvbmNlIHRoZSBjZWxsIGlzIGNsaWNrZWQgKi9cbiAgLyogVGhlIG91dGVyIG1vZHVsZSwgZ2FtZSwgd2lsbCBhd2FpdCBmb3IgdGhlIHByb21pc2UgdG8gcmVzb2x2ZSwgKi9cbiAgLyogQW5kIHRoZSBtb3ZlIGNhcHR1cmVkIGluIHRoaXMgbW9kdWxlIHdpbGwgYmUgaGFuZGxlZCAqL1xuXG4gIGZ1bmN0aW9uIHBsYXllck1vdmUocGxheWVyKSB7XG4gICAgcmVtb3ZlQWxsTW92ZUxpc3RlbmVycygpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIF9hZGRNb3ZlTGlzdGVuZXJGb3JFbmVteUNlbGxzKHJlc29sdmUsICcuanMtY2VsbC0tY29tcHV0ZXInKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXB1dGVyTW92ZShjb21wdXRlcikge1xuICAgIHJlbW92ZUFsbE1vdmVMaXN0ZW5lcnMoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBfYWRkTW92ZUxpc3RlbmVyRm9yRW5lbXlDZWxscyhyZXNvbHZlLCAnLmpzLWNlbGwtLXBsYXllcicpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbXB1dGVyLm1ha2VNb3ZlKCk7XG4gICAgICB9LCA1MDApO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2FkZE1vdmVMaXN0ZW5lckZvckVuZW15Q2VsbHMoXG4gICAgcHJvbWlzZVJlc29sdmVDYWxsYmFjayxcbiAgICBlbmVteUNlbGxzSFRNTENsYXNzLFxuICApIHtcbiAgICBjb25zdCBlbmVteUNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbmVteUNlbGxzSFRNTENsYXNzKTtcblxuICAgIGVuZW15Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT5cbiAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBpZiAoIWUudGFyZ2V0LmRhdGFzZXQuY29vcmRpbmF0ZSkgcmV0dXJuO1xuICAgICAgICBQbGF5ZXJNYW5hZ2VyLmhhbmRsZUdhbWVib2FyZEF0dGFjayhlLnRhcmdldC5kYXRhc2V0LmNvb3JkaW5hdGUpO1xuICAgICAgICBwcm9taXNlUmVzb2x2ZUNhbGxiYWNrKCk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQWxsTW92ZUxpc3RlbmVycygpIHtcbiAgICBjb25zdCBjZWxsc1dpdGhMaXN0ZW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgYC5qcy1jZWxsLS1wbGF5ZXIsIC5qcy1jZWxsLS1jb21wdXRlcmAsXG4gICAgKTtcblxuICAgIGNlbGxzV2l0aExpc3RlbmVycy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBsZXQgY2VsbFdpdGhvdXRMaXN0ZW5lciA9IGNlbGwuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgY2VsbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjZWxsV2l0aG91dExpc3RlbmVyLCBjZWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZUN1cnJlbnRQbGF5ZXIoKSB7XG4gICAgaWYgKF9jdXJyZW50UGxheWVyID09PSAncGxheWVyJykge1xuICAgICAgX2N1cnJlbnRQbGF5ZXIgPSAnY29tcHV0ZXInO1xuICAgIH0gZWxzZSB7XG4gICAgICBfY3VycmVudFBsYXllciA9ICdwbGF5ZXInO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9kaXNhYmxlU3RhcnRHYW1lSW50ZXJmYWNlKCkge1xuICAgIGNvbnN0IGJ1dHRvbnNXaXRoTGlzdGVuZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXJhbmRvbSwgLmpzLXN0YXJ0Jyk7XG5cbiAgICBidXR0b25zV2l0aExpc3RlbmVycy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgIGxldCBidXR0b25XaXRob3V0TGlzdGVuZXIgPSBidXR0b24uY2xvbmVOb2RlKHRydWUpO1xuICAgICAgYnV0dG9uLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGJ1dHRvbldpdGhvdXRMaXN0ZW5lciwgYnV0dG9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF90b2dnbGVTdGFydEdhbWVJbnRlcmZhY2VWaXNpYmlsaXR5KCkge1xuICAgIGNvbnN0IGNvbXB1dGVyR2FtZWJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWNvbXB1dGVyLWdhbWVib2FyZCcpO1xuICAgIGNvbnN0IGdhbWVib2FyZEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtcmFuZG9tLCAuanMtc3RhcnQnKTtcblxuICAgIGNvbXB1dGVyR2FtZWJvYXJkLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXZpc2libGUnKTtcbiAgICBnYW1lYm9hcmRCdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4gYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXZpc2libGUnKSk7XG4gIH1cblxuICBmdW5jdGlvbiBfdG9nZ2xlQm9hcmREZXNjcmlwdGlvbnMoKSB7XG4gICAgY29uc3QgZGVzY3JpcHRpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWRlc2NyaXB0aW9uJyk7XG4gICAgZGVzY3JpcHRpb25zLmZvckVhY2goKG5vZGUpID0+IG5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtdmlzaWJsZScpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhcnRHYW1lLFxuICAgIHN0b3BHYW1lLFxuICAgIHNob3dHYW1lUmVzdWx0LFxuICAgIHRvZ2dsZVJlc3VsdCxcbiAgICB0b2dnbGVDdXJyZW50UGxheWVyLFxuICAgIHBsYXllck1vdmUsXG4gICAgY29tcHV0ZXJNb3ZlLFxuICAgIHNob3dSZXN0YXJ0LFxuICAgIHJlbW92ZUFsbE1vdmVMaXN0ZW5lcnMsXG4gIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBVSUdhbWVTdGF0ZTtcbiIsImZ1bmN0aW9uIGFkZFJlc3RhcnRFdmVudChjYWxsYmFjaykge1xuICBjb25zdCByZXN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXJlc3RhcnQnKTtcbiAgcmVzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNhbGxiYWNrKTtcbn1cblxuZXhwb3J0IHsgYWRkUmVzdGFydEV2ZW50IH07XG4iLCJmdW5jdGlvbiBhZGRFdmVudHNUb1N0YXJ0TWVudUJ1dHRvbnMoc3RhcnRDYWxsYmFjaywgcmFuZG9tQ2FsbGJhY2spIHtcbiAgY29uc3Qgc3RhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtc3RhcnQnKTtcbiAgY29uc3QgcmFuZG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXJhbmRvbScpO1xuICBzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN0YXJ0Q2FsbGJhY2spO1xuICByYW5kb20uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByYW5kb21DYWxsYmFjayk7XG59XG5cbmV4cG9ydCB7IGFkZEV2ZW50c1RvU3RhcnRNZW51QnV0dG9ucyB9O1xuIiwiaW1wb3J0IFBsYXllck1hbmFnZXIgZnJvbSAnLi9wbGF5ZXJfbWFuYWdlcic7XG5pbXBvcnQgSW5wdXQgZnJvbSAnLi91dGlscy9pbnB1dCc7XG5pbXBvcnQgU2hpcCBmcm9tICcuL3NoaXAnO1xuaW1wb3J0IFVJR2FtZVN0YXRlIGZyb20gJy4vZG9tL2dhbWVfc3RhdGUnO1xuaW1wb3J0IGdlbmVyYXRlU2hpcHNGb3JCb3RoUGxheWVycyBmcm9tICcuL3JhbmRvbV9zaGlwcyc7XG5pbXBvcnQgeyBzaG93SGl0QXRTaGlwLCBzaG93TWlzc2VkQXR0YWNrLCBzaG93U3Vua1NoaXAgfSBmcm9tICcuL2RvbS9iYXR0bGVmaWVsZCc7XG5pbXBvcnQgeyBDb21wdXRlciwgUGxheWVyIH0gZnJvbSAnLi9wbGF5ZXInO1xuaW1wb3J0IHsgZ2V0Q2VsbHNTdXJyb3VuZGluZ1NoaXAgfSBmcm9tICcuL3V0aWxzL2hlbHBlcic7XG5cbmNvbnN0IEdhbWUgPSAoKCkgPT4ge1xuICBsZXQgX2dhbWVHb2luZyA9IGZhbHNlO1xuICBsZXQgX3dpbm5lciA9IG51bGw7XG4gIGxldCBwbGF5ZXIgPSBudWxsO1xuICBsZXQgY29tcHV0ZXIgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgIF9pbml0UGxheWVycygpO1xuICAgIF9wbGFjZVNoaXBzKHBsYXllciwgY29tcHV0ZXIpO1xuICAgIF9pbml0VUkoKTtcblxuICAgIF9nYW1lR29pbmcgPSB0cnVlO1xuICAgIF9nYW1lbG9vcCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gX3N0b3AoKSB7XG4gICAgX2dhbWVHb2luZyA9IGZhbHNlO1xuICAgIElucHV0LmNsZWFyKCk7XG4gIH1cblxuICBmdW5jdGlvbiBfaW5pdFBsYXllcnMoKSB7XG4gICAgcGxheWVyID0gbmV3IFBsYXllcigncGxheWVyJyk7XG4gICAgY29tcHV0ZXIgPSBuZXcgQ29tcHV0ZXIoJ2NvbXB1dGVyJyk7XG5cbiAgICBQbGF5ZXJNYW5hZ2VyLmFkZFBsYXllcihwbGF5ZXIpO1xuICAgIFBsYXllck1hbmFnZXIuYWRkUGxheWVyKGNvbXB1dGVyKTtcbiAgICBQbGF5ZXJNYW5hZ2VyLnNldEN1cnJlbnQocGxheWVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9pbml0VUkoKSB7XG4gICAgVUlHYW1lU3RhdGUuc3RhcnRHYW1lKCk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBfZ2FtZWxvb3AoKSB7XG4gICAgd2hpbGUgKF9nYW1lR29pbmcpIHtcbiAgICAgIGF3YWl0IG5leHRNb3ZlKCk7XG5cbiAgICAgIGNvbnN0IGF0dGFja2VyID0gUGxheWVyTWFuYWdlci5nZXRDdXJyZW50KCk7XG4gICAgICBjb25zdCBhdHRhY2tlZCA9IFBsYXllck1hbmFnZXIuZ2V0Tm90Q3VycmVudCgpO1xuXG4gICAgICBpZiAoIWF0dGFja2VkLmdhbWVib2FyZC5jaGVja0xhc3RBdHRhY2tTdWNjZXNzZnVsKCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghYXR0YWNrZWQuZ2FtZWJvYXJkLmNoZWNrTGFzdEF0dGFja0hpdFNoaXAoKSkge1xuICAgICAgICAvKiBJZiB0aGUgbGFzdCBhdHRhY2sgZGlkIG5vdCBoaXQgYSBzaGlwICovXG4gICAgICAgIFBsYXllck1hbmFnZXIudG9nZ2xlQ3VycmVudCgpO1xuICAgICAgICBVSUdhbWVTdGF0ZS50b2dnbGVDdXJyZW50UGxheWVyKCk7XG5cbiAgICAgICAgc2hvd01pc3NlZEF0dGFjayhhdHRhY2tlZC5nYW1lYm9hcmQuZ2V0TGFzdEF0dGFjaygpLCBhdHRhY2tlZC5uYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dIaXRBdFNoaXAoYXR0YWNrZWQuZ2FtZWJvYXJkLmdldExhc3RBdHRhY2soKSwgYXR0YWNrZWQubmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRhY2tlZC5nYW1lYm9hcmQuY2hlY2tMYXN0QXR0YWNrU2Fua1NoaXAoKSkge1xuICAgICAgICBjb25zdCBzdW5rU2hpcCA9IGF0dGFja2VkLmdhbWVib2FyZC5nZXRMYXN0QXR0YWNrZWRTaGlwKCk7XG5cbiAgICAgICAgX2F0dGFja0NlbGxzQXJvdW5kU3Vua1NoaXAoYXR0YWNrZWQsIHN1bmtTaGlwKTtcbiAgICAgICAgc2hvd1N1bmtTaGlwKFxuICAgICAgICAgIHN1bmtTaGlwLmdldENvb3JkaW5hdGVzKCksXG4gICAgICAgICAgUGxheWVyTWFuYWdlci5nZXRQbGF5ZXJOYW1lKGF0dGFja2VkKSxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF0dGFja2VkLmlzR2FtZU92ZXIoKSkge1xuICAgICAgICBfc3RvcCgpO1xuICAgICAgICBfd2lubmVyID0gYXR0YWNrZXI7XG5cbiAgICAgICAgVUlHYW1lU3RhdGUuc3RvcEdhbWUoKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgVUlHYW1lU3RhdGUuc2hvd0dhbWVSZXN1bHQoX3dpbm5lciA9PT0gcGxheWVyID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgICAgfSwgMzAwKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBuZXh0TW92ZSgpIHtcbiAgICAgIGlmIChQbGF5ZXJNYW5hZ2VyLmdldEN1cnJlbnQoKSA9PT0gcGxheWVyKSB7XG4gICAgICAgIGF3YWl0IFVJR2FtZVN0YXRlLnBsYXllck1vdmUocGxheWVyKTtcbiAgICAgIH0gZWxzZSBpZiAoUGxheWVyTWFuYWdlci5nZXRDdXJyZW50KCkgPT09IGNvbXB1dGVyKSB7XG4gICAgICAgIGF3YWl0IFVJR2FtZVN0YXRlLmNvbXB1dGVyTW92ZShjb21wdXRlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX3BsYWNlU2hpcHMocGxheWVyLCBjb21wdXRlcikge1xuICAgIGNvbnN0IHBsYXllclNoaXBzID0gSW5wdXQuZ2V0UGxheWVyU2hpcHMoKTtcbiAgICBjb25zdCBjb21wdXRlclNoaXBzID0gSW5wdXQuZ2V0Q29tcHV0ZXJTaGlwcygpO1xuXG4gICAgcGxheWVyU2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4gcGxheWVyLmdhbWVib2FyZC5wbGFjZVNoaXAoc2hpcCkpO1xuICAgIGNvbXB1dGVyU2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4gY29tcHV0ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChzaGlwKSk7XG4gIH1cblxuICBmdW5jdGlvbiBfYXR0YWNrQ2VsbHNBcm91bmRTdW5rU2hpcChhdHRhY2tlZCwgc3Vua1NoaXApIHtcbiAgICBjb25zdCBjZWxsc1RvQXR0YWNrID0gZ2V0Q2VsbHNTdXJyb3VuZGluZ1NoaXAoc3Vua1NoaXAuZ2V0Q29vcmRpbmF0ZXMoKSk7XG4gICAgY2VsbHNUb0F0dGFjay5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBhdHRhY2tlZC5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjZWxsKTtcblxuICAgICAgaWYgKGF0dGFja2VkLmdhbWVib2FyZC5jaGVja0xhc3RBdHRhY2tTdWNjZXNzZnVsKCkpIHtcbiAgICAgICAgc2hvd01pc3NlZEF0dGFjayhjZWxsLCBQbGF5ZXJNYW5hZ2VyLmdldFBsYXllck5hbWUoYXR0YWNrZWQpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFVJR2FtZVN0YXRlLnJlbW92ZUFsbE1vdmVMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhcnQsXG4gIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IHsgc3RyaW5naWZ5RWxlbWVudHMgfSBmcm9tICcuL3V0aWxzL2hlbHBlcic7XG5cbmZ1bmN0aW9uIEdhbWVib2FyZCgpIHtcbiAgY29uc3QgX2xlbmd0aCA9IDEwOyAvLyAxMCB4IDEwIGJvYXJkXG4gIGNvbnN0IF9zaGlwcyA9IFtdO1xuICBjb25zdCBfbWlzc2VkQXR0YWNrcyA9IFtdO1xuICBjb25zdCBfYXR0YWNrcyA9IFtdO1xuXG4gIHRoaXMuZ2V0TGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfbGVuZ3RoO1xuICB9O1xuXG4gIHRoaXMuZ2V0U2hpcHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFsuLi5fc2hpcHNdO1xuICB9O1xuXG4gIHRoaXMuZ2V0TWlzc2VkQXR0YWNrcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gWy4uLl9taXNzZWRBdHRhY2tzXTtcbiAgfTtcblxuICB0aGlzLmdldEFsbEF0dGFja3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFsuLi5fYXR0YWNrc107XG4gIH07XG5cbiAgdGhpcy5nZXRQb3NzaWJsZUF0dGFja3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWxsQ2VsbHMoKS5maWx0ZXIoXG4gICAgICAoY2VsbCkgPT4gIXN0cmluZ2lmeUVsZW1lbnRzKF9hdHRhY2tzKS5pbmNsdWRlcyhjZWxsLnRvU3RyaW5nKCkpLFxuICAgICk7XG4gIH07XG5cbiAgdGhpcy5nZXRMYXN0QXR0YWNrID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfYXR0YWNrc1tfYXR0YWNrcy5sZW5ndGggLSAxXTtcbiAgfTtcblxuICB0aGlzLmdldExhc3RBdHRhY2tlZFNoaXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbGFzdEF0dGFjayA9IHRoaXMuZ2V0TGFzdEF0dGFjaygpO1xuXG4gICAgY29uc3QgbGFzdEF0dGFja2VkU2hpcCA9IF9zaGlwcy5maW5kKChzaGlwKSA9PlxuICAgICAgc2hpcFxuICAgICAgICAuZ2V0Q29vcmRpbmF0ZXMoKVxuICAgICAgICAuc29tZSgoY29vcmRpbmF0ZSkgPT4gY29vcmRpbmF0ZS50b1N0cmluZygpID09PSBsYXN0QXR0YWNrLnRvU3RyaW5nKCkpLFxuICAgICk7XG5cbiAgICByZXR1cm4gbGFzdEF0dGFja2VkU2hpcDtcbiAgfTtcblxuICB0aGlzLmNoZWNrTGFzdEF0dGFja0hpdFNoaXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbGFzdEF0dGFjayA9IHRoaXMuZ2V0TGFzdEF0dGFjaygpO1xuICAgIGNvbnN0IGNoZWNrUmVzdWx0ID0gX3NoaXBzLmZpbmQoKHNoaXApID0+XG4gICAgICBzdHJpbmdpZnlFbGVtZW50cyhzaGlwLmdldENvb3JkaW5hdGVzKCkpLmluY2x1ZGVzKGxhc3RBdHRhY2sudG9TdHJpbmcoKSksXG4gICAgKTtcblxuICAgIHJldHVybiBjaGVja1Jlc3VsdCA/IHRydWUgOiBmYWxzZTtcbiAgfTtcblxuICB0aGlzLmNoZWNrTGFzdEF0dGFja1NhbmtTaGlwID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGxhc3RBdHRhY2sgPSB0aGlzLmdldExhc3RBdHRhY2soKTtcbiAgICBjb25zdCBsYXN0U2hpcEhpdCA9IF9zaGlwcy5maW5kKChzaGlwKSA9PlxuICAgICAgc3RyaW5naWZ5RWxlbWVudHMoc2hpcC5nZXRDb29yZGluYXRlcygpKS5pbmNsdWRlcyhsYXN0QXR0YWNrLnRvU3RyaW5nKCkpLFxuICAgICk7XG5cbiAgICByZXR1cm4gbGFzdFNoaXBIaXQgPyBsYXN0U2hpcEhpdC5pc1N1bmsoKSA6IGZhbHNlO1xuICB9O1xuXG4gIHRoaXMuZ2V0QWxsQ2VsbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYWxsQ2VsbHMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IF9sZW5ndGg7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDE7IGogPD0gX2xlbmd0aDsgaisrKSB7XG4gICAgICAgIGFsbENlbGxzLnB1c2goW2ksIGpdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gWy4uLmFsbENlbGxzXTtcbiAgfTtcblxuICBmdW5jdGlvbiBfcGxhY2VNaXNzZWRBdHRhY2soYXR0YWNrQ29vcmRpbmF0ZSkge1xuICAgIF9taXNzZWRBdHRhY2tzLnB1c2goYXR0YWNrQ29vcmRpbmF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBfcGxhY2VBdHRhY2soYXR0YWNrQ29vcmRpbmF0ZSkge1xuICAgIF9hdHRhY2tzLnB1c2goYXR0YWNrQ29vcmRpbmF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBfaXNBdHRhY2tpbmdBbHJlYWR5QXR0YWNrZWRDZWxsKGF0dGFja0Nvb3JkaW5hdGVTdHIpIHtcbiAgICBmb3IgKGNvbnN0IGF0dGFjayBvZiBfYXR0YWNrcykge1xuICAgICAgaWYgKGF0dGFjay50b1N0cmluZygpID09PSBhdHRhY2tDb29yZGluYXRlU3RyKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMucGxhY2VTaGlwID0gZnVuY3Rpb24gKHNoaXApIHtcbiAgICBfc2hpcHMucHVzaChzaGlwKTtcbiAgfTtcblxuICB0aGlzLmFyZUFsbFNoaXBzU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX3NoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLmlzU3VuaygpKTtcbiAgfTtcblxuICBsZXQgX2xhc3RBdHRhY2tTdWNjZXNzZnVsO1xuXG4gIHRoaXMuY2hlY2tMYXN0QXR0YWNrU3VjY2Vzc2Z1bCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX2xhc3RBdHRhY2tTdWNjZXNzZnVsO1xuICB9O1xuXG4gIHRoaXMucmVjZWl2ZUF0dGFjayA9IGZ1bmN0aW9uIChhdHRhY2tDb29yZGluYXRlKSB7XG4gICAgLyogQ2hlY2sgaWYgaXQgZG9lcyBub3QgYXR0YWNrIGFuIGFscmVhZHkgYXR0YWNrZWQgY29vcmRpbmF0ZSAqL1xuICAgIGNvbnN0IGF0dGFja0Nvb3JkaW5hdGVTdHIgPSBhdHRhY2tDb29yZGluYXRlLnRvU3RyaW5nKCk7XG5cbiAgICBpZiAoX2lzQXR0YWNraW5nQWxyZWFkeUF0dGFja2VkQ2VsbChhdHRhY2tDb29yZGluYXRlU3RyKSkge1xuICAgICAgX2xhc3RBdHRhY2tTdWNjZXNzZnVsID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgX3BsYWNlQXR0YWNrKGF0dGFja0Nvb3JkaW5hdGUpO1xuXG4gICAgZm9yIChjb25zdCBzaGlwIG9mIF9zaGlwcykge1xuICAgICAgZm9yIChjb25zdCBzaGlwQ29vcmRpbmF0ZSBvZiBzaGlwLmdldENvb3JkaW5hdGVzKCkpIHtcbiAgICAgICAgaWYgKHNoaXBDb29yZGluYXRlLnRvU3RyaW5nKCkgPT09IGF0dGFja0Nvb3JkaW5hdGVTdHIpIHtcbiAgICAgICAgICAvLyBoaXRTaGlwKHNoaXAsIHNoaXAuZ2V0Q29vcmRpbmF0ZXMoKS5pbmRleE9mKHNoaXBDb29yZGluYXRlKSk7XG4gICAgICAgICAgc2hpcC5oaXQoc2hpcC5nZXRDb29yZGluYXRlcygpLmluZGV4T2Yoc2hpcENvb3JkaW5hdGUpKTsgLy8gaGl0IHRoZSBzaGlwIGF0IHRoaXMgcG9zaXRpb25cbiAgICAgICAgICBfbGFzdEF0dGFja1N1Y2Nlc3NmdWwgPSB0cnVlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9wbGFjZU1pc3NlZEF0dGFjayhhdHRhY2tDb29yZGluYXRlKTtcbiAgICBfbGFzdEF0dGFja1N1Y2Nlc3NmdWwgPSB0cnVlO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQ7XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gJy4vZ2FtZWJvYXJkJztcbmltcG9ydCBQbGF5ZXJNYW5hZ2VyIGZyb20gJy4vcGxheWVyX21hbmFnZXInO1xuaW1wb3J0IHsgZ2V0UGVycGVuZGljdWxhckNlbGxzIH0gZnJvbSAnLi91dGlscy9oZWxwZXInO1xuaW1wb3J0IHsgc3RyaW5naWZ5RWxlbWVudHMgfSBmcm9tICcuL3V0aWxzL2hlbHBlcic7XG5cbmNsYXNzIFBsYXllciB7XG4gICNnYW1lYm9hcmQ7XG4gICNuYW1lO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLiNuYW1lID0gbmFtZTtcbiAgICB0aGlzLiNnYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgUGxheWVyTWFuYWdlci5hZGRQbGF5ZXIodGhpcyk7XG4gIH1cblxuICBnZXQgZ2FtZWJvYXJkKCkge1xuICAgIHJldHVybiB0aGlzLiNnYW1lYm9hcmQ7XG4gIH1cblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbmFtZTtcbiAgfVxuXG4gIGlzR2FtZU92ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2dhbWVib2FyZC5hcmVBbGxTaGlwc1N1bmsoKTtcbiAgfVxufVxuXG5jbGFzcyBDb21wdXRlciBleHRlbmRzIFBsYXllciB7XG4gICNsYXN0SGl0QXRTaGlwID0gbnVsbDtcblxuICAjdHJ5aW5nVG9TaW5rU2hpcCA9IGZhbHNlOyAvLyBJdCB3aWxsIHRyeSB0byBzaW5rIGEgc2hpcCBpZiBpdCBoaXQgaXRcblxuICAjZmlyc3RIaXRBdFNoaXAgPSBudWxsOyAvLyBUaGUgdmVyeSBmaXJzdCBzaGlwJ3MgY29vcmRpbmF0ZSBhdHRhY2tlZFxuXG4gIC8vIElmIHRoZSBzaGlwIGlzIGF0dGFja2VkIHR3aWNlLCBpdCB3aWxsIGRldGVybWluZSB3aGV0aGVyIHRoZSBzaGlwIGlzIGhvcml6b250YWwgb3IgdmVydGljYWxcbiAgI2F0dGFja0RpcmVjdGlvbiA9IG51bGw7XG5cbiAgI2hpdHNBdFNoaXAgPSBbXTsgLy8gQWxsIGhpdHMgYXQgdGhlIGN1cnJlbnQgc2hpcCB0aGF0IGl0IGlzIHRyeWluZyB0byBhdHRhY2sgYW5kIHNpbmtcbiAgI2d1ZXNzZWRTaGlwUG9zaXRpb25zID0gW107IC8vIEl0IHdpbGwgZ3Vlc3Mgd2hlcmUgdGhlIHNoaXAgbWF5IGJlXG5cbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHN1cGVyKG5hbWUpO1xuICB9XG5cbiAgLyogR2V0dGVycyBhbmQgc2V0dGVycyBhcmUgZm9yIHRlc3RpbmcgcHVycG9zZXMgb25seSAqL1xuXG4gIGdldCBsYXN0SGl0QXRTaGlwKCkge1xuICAgIHJldHVybiB0aGlzLiNsYXN0SGl0QXRTaGlwO1xuICB9XG5cbiAgZ2V0IHRyeWluZ1RvU2lua1NoaXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RyeWluZ1RvU2lua1NoaXA7XG4gIH1cblxuICBzZXQgbGFzdEhpdEF0U2hpcCh2YWx1ZSkge1xuICAgIHRoaXMuI2xhc3RIaXRBdFNoaXAgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldCB0cnlpbmdUb1NpbmtTaGlwKHZhbHVlKSB7XG4gICAgdGhpcy4jdHJ5aW5nVG9TaW5rU2hpcCA9IHZhbHVlO1xuICB9XG5cbiAgbWFrZU1vdmUoKSB7XG4gICAgY29uc3QgcG9zc2libGVBdHRhY2tzID0gUGxheWVyTWFuYWdlci5nZXRQbGF5ZXJQb3NzaWJsZUF0dGFja3ModGhpcyk7XG5cbiAgICBpZiAodGhpcy4jdHJ5aW5nVG9TaW5rU2hpcCkge1xuICAgICAgdGhpcy5jdXJyZW50QXR0YWNrID0gdGhpcy4jZ2V0UG90ZW50aWFsQXR0YWNrVG9TaW5rU2hpcChwb3NzaWJsZUF0dGFja3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRBdHRhY2sgPSB0aGlzLiNnZXRSYW5kb21Db29yZGluYXRlcyhwb3NzaWJsZUF0dGFja3MpO1xuICAgIH1cblxuICAgIHRoaXMuI2F0dGFja0luRE9NKHRoaXMuY3VycmVudEF0dGFjayk7XG4gICAgdGhpcy5kZWZpbmVOZXh0TW92ZSgpO1xuICB9XG5cbiAgI2dldFJhbmRvbUNvb3JkaW5hdGVzKHBvc3NpYmxlQXR0YWNrcykge1xuICAgIHJldHVybiBwb3NzaWJsZUF0dGFja3NbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVBdHRhY2tzLmxlbmd0aCldO1xuICB9XG5cbiAgI2dldFBvdGVudGlhbEF0dGFja1RvU2lua1NoaXAoYWxsVmFsaWRBdHRhY2tzKSB7XG4gICAgaWYgKHRoaXMuI2ZpcnN0SGl0QXRTaGlwLnRvU3RyaW5nKCkgIT09IHRoaXMuI2xhc3RIaXRBdFNoaXAudG9TdHJpbmcoKSkge1xuICAgICAgLy8gaWYgY29tcHV0ZXIgaGFzIGFscmVhZHkgYXR0YWNrZWQgYSBzaGlwIHR3aWNlIG9yIG1vcmUgdGltZXMsXG4gICAgICAvLyBkZWZpbmUgdGhlIGRpcmVjdGlvbiBpbiB3aGljaCB0byBhdHRhY2sgbmV4dFxuICAgICAgdGhpcy4jc2V0QXR0YWNrRGlyZWN0aW9uKCk7XG4gICAgICB0aGlzLiNndWVzc1NoaXBQb3NpdGlvbnMoKTtcblxuICAgICAgY29uc3QgYXR0YWNrc1RvVmFsaWRhdGUgPSBbLi4udGhpcy4jZ3Vlc3NlZFNoaXBQb3NpdGlvbnNdO1xuXG4gICAgICBhbGxWYWxpZEF0dGFja3MgPSBzdHJpbmdpZnlFbGVtZW50cyhhbGxWYWxpZEF0dGFja3MpO1xuXG4gICAgICBjb25zdCB2YWxpZEd1ZXNzZWRBdHRhY2tzID0gYXR0YWNrc1RvVmFsaWRhdGUuZmlsdGVyKChhdHRhY2spID0+XG4gICAgICAgIGFsbFZhbGlkQXR0YWNrcy5pbmNsdWRlcyhhdHRhY2sudG9TdHJpbmcoKSksXG4gICAgICApO1xuXG4gICAgICBjb25zdCBuZXh0QXR0YWNrID1cbiAgICAgICAgdmFsaWRHdWVzc2VkQXR0YWNrc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2YWxpZEd1ZXNzZWRBdHRhY2tzLmxlbmd0aCldO1xuXG4gICAgICByZXR1cm4gbmV4dEF0dGFjaztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2VsbHNXaGVyZU1heUJlU2hpcCA9IGdldFBlcnBlbmRpY3VsYXJDZWxscyh0aGlzLiNsYXN0SGl0QXRTaGlwKTsgLy8gV2hlcmUgdGhlcmUgbWlnaHQgYmUgYSBzaGlwXG5cbiAgICAgIGFsbFZhbGlkQXR0YWNrcyA9IHN0cmluZ2lmeUVsZW1lbnRzKGFsbFZhbGlkQXR0YWNrcyk7XG5cbiAgICAgIGNvbnN0IHZhbGlkQ2VsbHNXaGVyZU1heUJlU2hpcCA9IGNlbGxzV2hlcmVNYXlCZVNoaXAuZmlsdGVyKChjZWxsKSA9PlxuICAgICAgICBhbGxWYWxpZEF0dGFja3MuaW5jbHVkZXMoY2VsbC50b1N0cmluZygpKSxcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiB2YWxpZENlbGxzV2hlcmVNYXlCZVNoaXBbXG4gICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZhbGlkQ2VsbHNXaGVyZU1heUJlU2hpcC5sZW5ndGgpXG4gICAgICBdO1xuICAgIH1cbiAgfVxuXG4gICNzZXRBdHRhY2tEaXJlY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuI2ZpcnN0SGl0QXRTaGlwWzBdIC0gdGhpcy4jbGFzdEhpdEF0U2hpcFswXSA9PT0gMCkge1xuICAgICAgdGhpcy4jYXR0YWNrRGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy4jZmlyc3RIaXRBdFNoaXBbMV0gLSB0aGlzLiNsYXN0SGl0QXRTaGlwWzFdID09PSAwKSB7XG4gICAgICB0aGlzLiNhdHRhY2tEaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG4gICAgfVxuICB9XG5cbiAgI2d1ZXNzU2hpcFBvc2l0aW9ucygpIHtcbiAgICB0aGlzLiNoaXRzQXRTaGlwLmZvckVhY2goKGhpdCkgPT4ge1xuICAgICAgaWYgKHRoaXMuI2F0dGFja0RpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICB0aGlzLiNndWVzc2VkU2hpcFBvc2l0aW9ucy5wdXNoKFxuICAgICAgICAgIFtOdW1iZXIoaGl0WzBdKSwgTnVtYmVyKGhpdFsxXSkgLSAxXSxcbiAgICAgICAgICBbTnVtYmVyKGhpdFswXSksIE51bWJlcihoaXRbMV0pICsgMV0sXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLiNhdHRhY2tEaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICB0aGlzLiNndWVzc2VkU2hpcFBvc2l0aW9ucy5wdXNoKFxuICAgICAgICAgIFtOdW1iZXIoaGl0WzBdKSAtIDEsIE51bWJlcihoaXRbMV0pXSxcbiAgICAgICAgICBbTnVtYmVyKGhpdFswXSkgKyAxLCBOdW1iZXIoaGl0WzFdKV0sXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAjYXR0YWNrSW5ET00oYXR0YWNrKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmpzLWNlbGwtLXBsYXllcltkYXRhLWNvb3JkaW5hdGU9XCIke2F0dGFja31cIl1gKS5jbGljaygpO1xuICB9XG5cbiAgZGVmaW5lTmV4dE1vdmUoKSB7XG4gICAgaWYgKFxuICAgICAgUGxheWVyTWFuYWdlci5jaGVja0xhc3RBdHRhY2tBdEVuZW15SGl0U2hpcCgpICYmXG4gICAgICAhUGxheWVyTWFuYWdlci5jaGVja0xhc3RBdHRhY2tBdEVuZW15U2Fua1NoaXAoKVxuICAgICkge1xuICAgICAgdGhpcy4jZGVmaW5lTmV4dE1vdmVBc1NoaXBBdHRhY2soKTtcbiAgICB9IGVsc2UgaWYgKFBsYXllck1hbmFnZXIuY2hlY2tMYXN0QXR0YWNrQXRFbmVteVNhbmtTaGlwKCkpIHtcbiAgICAgIHRoaXMuI2RlZmluZU5leHRNb3ZlQXNSYW5kb21BdHRhY2soKTtcbiAgICB9XG4gIH1cblxuICAjZGVmaW5lTmV4dE1vdmVBc1NoaXBBdHRhY2soKSB7XG4gICAgY29uc3QgbGFzdEF0dGFjayA9IFBsYXllck1hbmFnZXIuZ2V0TGFzdEF0dGFja0F0RW5lbXkoKTtcbiAgICBpZiAoIXRoaXMuI2xhc3RIaXRBdFNoaXApIHtcbiAgICAgIC8vIGlmIGl0IGlzIGZpcnN0IGF0dGFjayBhdCB0aGUgc2hpcCAoaXQgd2Fzbid0IGF0dGFja2VkIGJlZm9yZSBhbmQgbGFzdCBoaXQgaXMgZmFsc3kpXG4gICAgICB0aGlzLiNmaXJzdEhpdEF0U2hpcCA9IGxhc3RBdHRhY2s7XG4gICAgfVxuICAgIHRoaXMuI3RyeWluZ1RvU2lua1NoaXAgPSB0cnVlO1xuICAgIHRoaXMuI2xhc3RIaXRBdFNoaXAgPSBsYXN0QXR0YWNrO1xuICAgIHRoaXMuI2hpdHNBdFNoaXAucHVzaChsYXN0QXR0YWNrKTtcbiAgfVxuXG4gICNkZWZpbmVOZXh0TW92ZUFzUmFuZG9tQXR0YWNrKCkge1xuICAgIHRoaXMuI3RyeWluZ1RvU2lua1NoaXAgPSBmYWxzZTtcbiAgICB0aGlzLiNsYXN0SGl0QXRTaGlwID0gbnVsbDtcbiAgICB0aGlzLiNhdHRhY2tEaXJlY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuI2hpdHNBdFNoaXAgPSBbXTtcbiAgICB0aGlzLiNndWVzc2VkU2hpcFBvc2l0aW9ucyA9IFtdO1xuICB9XG59XG5cbmV4cG9ydCB7IFBsYXllciwgQ29tcHV0ZXIgfTtcbiIsImltcG9ydCB7IFBsYXllciwgQ29tcHV0ZXIgfSBmcm9tICcuL3BsYXllcic7XG5cbmNvbnN0IFBsYXllck1hbmFnZXIgPSAoKCkgPT4ge1xuICBsZXQgX2N1cnJlbnQ7XG4gIGxldCBfcGxheWVycyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGFkZFBsYXllcihwbGF5ZXIpIHtcbiAgICBpZiAoX3BsYXllcnMubGVuZ3RoID09PSAyKSB7XG4gICAgICBfcGxheWVycyA9IFtdOyAvLyBubyBtb3JlIHRoYW4gdHdvIHBsYXllcnMgYXJlIHN0b3JlZFxuICAgIH1cbiAgICBfcGxheWVycy5wdXNoKHBsYXllcik7XG4gIH1cblxuICBmdW5jdGlvbiB0b2dnbGVDdXJyZW50KCkge1xuICAgIF9jdXJyZW50ID0gZ2V0Tm90Q3VycmVudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q3VycmVudChwbGF5ZXIpIHtcbiAgICBfY3VycmVudCA9IHBsYXllcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEN1cnJlbnQoKSB7XG4gICAgcmV0dXJuIF9jdXJyZW50O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGxheWVyTmFtZShwbGF5ZXIpIHtcbiAgICAvLyBOZWVkIGZvciBET00gY2xhc3Nlc1xuICAgIHJldHVybiBwbGF5ZXIgaW5zdGFuY2VvZiBDb21wdXRlciA/ICdjb21wdXRlcicgOiAncGxheWVyJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5vdEN1cnJlbnQoKSB7XG4gICAgcmV0dXJuIF9jdXJyZW50ID09PSBfcGxheWVyc1swXSA/IF9wbGF5ZXJzWzFdIDogX3BsYXllcnNbMF07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQbGF5ZXJQb3NzaWJsZUF0dGFja3MocGxheWVyKSB7XG4gICAgLy8gRmluZHMgdGhlIGVuZW15IHBsYXllciBhbmQgZ2V0cyB0aGUgcG9zc2libGUgYXR0YWNrcyBmcm9tIHRoZWlyIGdhbWVib2FyZFxuICAgIHJldHVybiBfcGxheWVyc1xuICAgICAgLmZpbmQoKF9wbGF5ZXIpID0+IF9wbGF5ZXIgIT09IHBsYXllcilcbiAgICAgIC5nYW1lYm9hcmQuZ2V0UG9zc2libGVBdHRhY2tzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMYXN0QXR0YWNrQXRFbmVteSgpIHtcbiAgICBjb25zdCBlbmVteSA9IGdldE5vdEN1cnJlbnQoKTtcbiAgICByZXR1cm4gZW5lbXkuZ2FtZWJvYXJkLmdldExhc3RBdHRhY2soKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrTGFzdEF0dGFja0F0RW5lbXlIaXRTaGlwKCkge1xuICAgIGNvbnN0IGVuZW15ID0gZ2V0Tm90Q3VycmVudCgpO1xuICAgIHJldHVybiBlbmVteS5nYW1lYm9hcmQuY2hlY2tMYXN0QXR0YWNrSGl0U2hpcCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tMYXN0QXR0YWNrQXRFbmVteVNhbmtTaGlwKCkge1xuICAgIGNvbnN0IGVuZW15ID0gZ2V0Tm90Q3VycmVudCgpO1xuICAgIHJldHVybiBlbmVteS5nYW1lYm9hcmQuY2hlY2tMYXN0QXR0YWNrU2Fua1NoaXAoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUdhbWVib2FyZEF0dGFjayhjb29yZGluYXRlcykge1xuICAgIGlmICghY29vcmRpbmF0ZXMpIHJldHVybjtcblxuICAgIGNvbnN0IGVuZW15ID0gZ2V0Tm90Q3VycmVudCgpO1xuICAgIGVuZW15LmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGVzLnNwbGl0KCcsJykpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzZXRDdXJyZW50LFxuICAgIGdldEN1cnJlbnQsXG4gICAgZ2V0Tm90Q3VycmVudCxcbiAgICBnZXRQbGF5ZXJOYW1lLFxuICAgIHRvZ2dsZUN1cnJlbnQsXG4gICAgYWRkUGxheWVyLFxuICAgIGdldFBsYXllclBvc3NpYmxlQXR0YWNrcyxcbiAgICBoYW5kbGVHYW1lYm9hcmRBdHRhY2ssXG4gICAgY2hlY2tMYXN0QXR0YWNrQXRFbmVteUhpdFNoaXAsXG4gICAgY2hlY2tMYXN0QXR0YWNrQXRFbmVteVNhbmtTaGlwLFxuICAgIGdldExhc3RBdHRhY2tBdEVuZW15LFxuICB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyTWFuYWdlcjtcbiIsImltcG9ydCB7XG4gIHZhbGlkYXRlUmVsYXRpdmVTaGlwUGxhY2VtZW50LFxuICBnZXRWYWxpZFBsYWNlbWVudENlbGxzLFxufSBmcm9tICcuL3NoaXBfdmFsaWRhdG9yJztcblxuaW1wb3J0IElucHV0IGZyb20gJy4vdXRpbHMvaW5wdXQnO1xuaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwJztcblxuZnVuY3Rpb24gZ2VuZXJhdGVTaGlwc0ZvckJvdGhQbGF5ZXJzKCkge1xuICBnZW5lcmF0ZVNoaXBzUmFuZG9tbHkoKTtcbiAgZ2VuZXJhdGVTaGlwc1JhbmRvbWx5KCk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlU2hpcHNSYW5kb21seSgpIHtcbiAgY29uc3QgcmVhZHlTaGlwcyA9IFtdO1xuXG4gIGNvbnN0IGNhcnJpZXIgPSBnZXRWYWxpZFNoaXAoNCwgcmVhZHlTaGlwcyk7XG4gIHJlYWR5U2hpcHMucHVzaChjYXJyaWVyKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgIGNvbnN0IGJhdHRsZXNoaXAgPSBnZXRWYWxpZFNoaXAoMywgcmVhZHlTaGlwcyk7XG4gICAgcmVhZHlTaGlwcy5wdXNoKGJhdHRsZXNoaXApO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBjb25zdCBjcnVpc2VyID0gZ2V0VmFsaWRTaGlwKDIsIHJlYWR5U2hpcHMpO1xuICAgIHJlYWR5U2hpcHMucHVzaChjcnVpc2VyKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgY29uc3QgcGF0cm9sQm9hdCA9IGdldFZhbGlkU2hpcCgxLCByZWFkeVNoaXBzKTtcbiAgICByZWFkeVNoaXBzLnB1c2gocGF0cm9sQm9hdCk7XG4gIH1cblxuICBJbnB1dC5wbGFjZVNoaXBzKHJlYWR5U2hpcHMpO1xufVxuXG5mdW5jdGlvbiBnZXRWYWxpZFNoaXAoc2hpcExlbmd0aCwgYWxsU2hpcHMpIHtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBjb25zdCBnZW5lcmF0ZWRTaGlwID0gZ2VuZXJhdGVTaGlwKHNoaXBMZW5ndGgpO1xuXG4gICAgaWYgKHZhbGlkYXRlUmVsYXRpdmVTaGlwUGxhY2VtZW50KGdlbmVyYXRlZFNoaXAsIGFsbFNoaXBzKSkge1xuICAgICAgcmV0dXJuIGdlbmVyYXRlZFNoaXA7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlU2hpcChzaGlwTGVuZ3RoKSB7XG4gIGNvbnN0IHZhbGlkQ2VsbHMgPSBnZXRWYWxpZFBsYWNlbWVudENlbGxzKHNoaXBMZW5ndGgpO1xuXG4gIGNvbnN0IGZpcnN0Q29vcmRpbmF0ZSA9IHZhbGlkQ2VsbHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdmFsaWRDZWxscy5sZW5ndGgpXTtcbiAgY29uc3QgY29vcmRpbmF0ZVggPSBmaXJzdENvb3JkaW5hdGVbMF07XG4gIGNvbnN0IGNvb3JkaW5hdGVZID0gZmlyc3RDb29yZGluYXRlWzFdO1xuXG4gIGNvbnN0IHNoaXBDb29yZGluYXRlcyA9IFtbLi4uZmlyc3RDb29yZGluYXRlXV07XG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcbiAgICAvLyBnbyBmcm9tIHRoZSBzZWNvbmQgY29vcmRpbmF0ZVxuICAgIHNoaXBDb29yZGluYXRlcy5wdXNoKFtjb29yZGluYXRlWCArIGksIGNvb3JkaW5hdGVZXSk7XG4gIH1cblxuICByZXR1cm4gbmV3IFNoaXAoLi4uc2hpcENvb3JkaW5hdGVzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVTaGlwc0ZvckJvdGhQbGF5ZXJzO1xuZXhwb3J0IHsgZ2VuZXJhdGVTaGlwc1JhbmRvbWx5IH07XG4iLCJmdW5jdGlvbiBTaGlwKC4uLmNvb3JkaW5hdGVzKSB7XG4gIC8qIENvb3JkaW5hdGVzIGFyZSBzaGlwJ3MgbG9jYXRpb24gb24gYm9hcmQgKi9cbiAgLyogVGhleSBhcmUgcmVjZWl2ZWQgYW5kIG5vdCBjcmVhdGVkIGhlcmUuIExvb2sgbGlrZSBbMiwgM10gKi9cbiAgLyogUG9zaXRpb25zIGFyZSBzaGlwJ3MgaW5uZXIgaGFuZGxpbmcgb2YgdGhlc2UgY29vcmRpbmF0ZXMgKi9cbiAgLyogUG9zaXRpb25zIGFyZSB1c2VkIHdoZW4gZGVjaWRpbmcgd2hlcmUgdGhlIHNoaXAgaXMgaGl0LCAqL1xuICAvKiBXaGV0aGVyIG9yIG5vdCBpdCBpcyBzdW5rLCBhbmQgd2hlcmUgZXhhY3RseSAqL1xuICAvKiBUbyBoaXQgdGhlIHNoaXAgaW4gdGhlIGZpcnN0IHBsYWNlICovXG5cbiAgY29uc3QgX3Bvc2l0aW9ucyA9IF9jcmVhdGVQb3NpdGlvbnMoY29vcmRpbmF0ZXMubGVuZ3RoKTtcblxuICBjb25zdCBfY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICB0aGlzLmdldENvb3JkaW5hdGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbLi4uX2Nvb3JkaW5hdGVzXTtcbiAgfTtcblxuICB0aGlzLmdldFBvc2l0aW9uID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIF9wb3NpdGlvbnNbcG9zaXRpb25dO1xuICB9O1xuXG4gIHRoaXMuaXNTdW5rID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChfcG9zaXRpb25zLmV2ZXJ5KChwb3NpdGlvbikgPT4gcG9zaXRpb24uaXNIaXQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLyogSGl0IG9uZSBvZiBzaGlwJ3MgcG9zaXRpb25zICovXG4gIHRoaXMuaGl0ID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgX3Bvc2l0aW9uc1twb3NpdGlvbl0uaXNIaXQgPSB0cnVlO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuXG5mdW5jdGlvbiBfY3JlYXRlUG9zaXRpb25zKGxlbmd0aCkge1xuICBjbGFzcyBQb3NpdGlvbiB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICB0aGlzLmlzSGl0ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcG9zaXRpb25zID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHBvc2l0aW9ucy5wdXNoKG5ldyBQb3NpdGlvbigpKTtcbiAgfVxuXG4gIHJldHVybiBwb3NpdGlvbnM7XG59XG4iLCJpbXBvcnQgeyBnZXRDZWxsc1N1cnJvdW5kaW5nU2hpcCwgc3RyaW5naWZ5RWxlbWVudHMgfSBmcm9tICcuL3V0aWxzL2hlbHBlcic7XG5cbi8qIFRoZSBwdXJwb3NlIG9mIHRoaXMgbW9kdWxlIGlzIHRvIG5vdCBhbGxvdyB0byBwbGFjZSBzaGlwcyAqL1xuLyogYWRqYWNlbnQgdG8gZWFjaCBvdGhlciBhbmQgb3V0c2lkZSB0aGUgZ2FtZWJvYXJkLiAqL1xuLyogVGhlcmUgbXVzdCBiZSBzb21lIHNwYWNlIGJldHdlZW4gdGhlbSAqL1xuXG4vKiBGaXJzdCwgaXQgZGVmaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgcGxhY2VtZW50IGlzIHZhbGlkIHJlbGF0aXZlIHRvIG90aGVyIHNoaXBzIG9uIGJvYXJkICovXG4vKiBTZWNvbmQsIGl0IGNoZWNrcyB3aGV0aGVyIG9yIG5vdCB0aGUgY29vcmRpbmF0ZXMgYXJlIG5vdCBvdXRzaWRlIHRoZSBnYW1lYm9hcmQgKi9cblxuZnVuY3Rpb24gdmFsaWRhdGVTaGlwUGxhY2VtZW50KHZhbGlkYXRlZFNoaXAsIGFsbFNoaXBzKSB7XG4gIGNvbnN0IHNoaXBDb29yZGluYXRlcyA9IHZhbGlkYXRlZFNoaXAuZ2V0Q29vcmRpbmF0ZXMoKTtcbiAgY29uc3Qgc2hpcExlbmd0aCA9IHNoaXBDb29yZGluYXRlcy5sZW5ndGg7XG4gIGNvbnN0IGZpcnN0Q29vcmRpbmF0ZSA9IHNoaXBDb29yZGluYXRlc1swXTtcblxuICBjb25zdCBpc1ZhbGlkUmVsYXRpdmUgPSB2YWxpZGF0ZVJlbGF0aXZlU2hpcFBsYWNlbWVudCh2YWxpZGF0ZWRTaGlwLCBhbGxTaGlwcyk7XG4gIGNvbnN0IGlzSW5zaWRlID0gIWlzT3V0c2lkZUdhbWVib2FyZChzaGlwTGVuZ3RoLCBmaXJzdENvb3JkaW5hdGUpO1xuXG4gIGNvbnN0IGlzVmFsaWQgPSBpc1ZhbGlkUmVsYXRpdmUgJiYgaXNJbnNpZGU7XG5cbiAgcmV0dXJuIGlzVmFsaWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRlU2hpcFBsYWNlbWVudDtcblxuZnVuY3Rpb24gdmFsaWRhdGVSZWxhdGl2ZVNoaXBQbGFjZW1lbnQodmFsaWRhdGVkU2hpcCwgYWxsU2hpcHMpIHtcbiAgLyogVmFsaWRhdGUgYWdhaW5zdCBvdGhlciBzaGlwcyAqL1xuXG4gIGNvbnN0IHNoaXBDZWxscyA9IHN0cmluZ2lmeUVsZW1lbnRzKHZhbGlkYXRlZFNoaXAuZ2V0Q29vcmRpbmF0ZXMoKSk7XG5cbiAgY29uc3QgYWRqYWNlbnRTaGlwQ29vcmRpbmF0ZXMgPSBzdHJpbmdpZnlFbGVtZW50cyhcbiAgICBnZXRBZGphY2VudFNoaXBDb29yZGluYXRlcyhhbGxTaGlwcyksXG4gICk7XG5cbiAgaWYgKHNoaXBDZWxscy5zb21lKChjZWxsKSA9PiBhZGphY2VudFNoaXBDb29yZGluYXRlcy5pbmNsdWRlcyhjZWxsKSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZ2V0QWRqYWNlbnRTaGlwQ29vcmRpbmF0ZXMoYWxsU2hpcHMpIHtcbiAgY29uc3QgYWRqYWNlbnRTaGlwQ29vcmRpbmF0ZXMgPSBhbGxTaGlwc1xuICAgIC5tYXAoKHNoaXApID0+IHtcbiAgICAgIGNvbnN0IHNoaXBDb29yZGluYXRlcyA9IHNoaXAuZ2V0Q29vcmRpbmF0ZXMoKTtcbiAgICAgIHJldHVybiBnZXRDZWxsc1N1cnJvdW5kaW5nU2hpcChzaGlwQ29vcmRpbmF0ZXMpO1xuICAgIH0pXG4gICAgLmZsYXQoKTtcblxuICBhbGxTaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgY29uc3Qgc2hpcENvb3JkaW5hdGVzID0gc2hpcC5nZXRDb29yZGluYXRlcygpO1xuICAgIHNoaXBDb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlKSA9PlxuICAgICAgYWRqYWNlbnRTaGlwQ29vcmRpbmF0ZXMucHVzaChzdHJpbmdpZnlFbGVtZW50cyhjb29yZGluYXRlKSksXG4gICAgKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFkamFjZW50U2hpcENvb3JkaW5hdGVzO1xufVxuXG5mdW5jdGlvbiBpc091dHNpZGVHYW1lYm9hcmQodmFsaWRhdGVkU2hpcExlbmd0aCwgZmlyc3RDb29yZGluYXRlKSB7XG4gIGNvbnN0IHZhbGlkQ2VsbHMgPSBnZXRWYWxpZFBsYWNlbWVudENlbGxzKHZhbGlkYXRlZFNoaXBMZW5ndGgpO1xuICBjb25zdCBpc1BsYWNlbWVudEludmFsaWQgPSB2YWxpZENlbGxzLmV2ZXJ5KFxuICAgIChjZWxsKSA9PiBjZWxsLnRvU3RyaW5nKCkgIT09IGZpcnN0Q29vcmRpbmF0ZS50b1N0cmluZygpLFxuICApO1xuXG4gIGlmIChpc1BsYWNlbWVudEludmFsaWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VmFsaWRQbGFjZW1lbnRDZWxscyh2YWxpZGF0ZWRTaGlwTGVuZ3RoKSB7XG4gIGNvbnN0IHZhbGlkUGxhY2VtZW50Q2VsbHMgPSBbXTtcblxuICBzd2l0Y2ggKHZhbGlkYXRlZFNoaXBMZW5ndGgpIHtcbiAgICBjYXNlIDQ6IHtcbiAgICAgIHZhbGlkUGxhY2VtZW50Q2VsbHMucHVzaCguLi5nZXRDZWxsc1ZhbGlkRm9yU2hpcEZvdXIoKSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSAzOiB7XG4gICAgICB2YWxpZFBsYWNlbWVudENlbGxzLnB1c2goLi4uZ2V0Q2VsbHNWYWxpZEZvclNoaXBUaHJlZSgpKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIDI6IHtcbiAgICAgIHZhbGlkUGxhY2VtZW50Q2VsbHMucHVzaCguLi5nZXRDZWxsc1ZhbGlkRm9yU2hpcFR3bygpKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIDE6IHtcbiAgICAgIHZhbGlkUGxhY2VtZW50Q2VsbHMucHVzaCguLi5nZXRBbGxCb2FyZCgpKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWxpZFBsYWNlbWVudENlbGxzO1xufVxuXG5mdW5jdGlvbiBnZXRDZWxsc1ZhbGlkRm9yU2hpcEZvdXIoKSB7XG4gIGNvbnN0IHZhbGlkQ2VsbHMgPSBbXTtcblxuICBmb3IgKGxldCB4ID0gMTsgeCA8PSA3OyB4KyspIHtcbiAgICBmb3IgKGxldCB5ID0gMTsgeSA8PSAxMDsgeSsrKSB7XG4gICAgICB2YWxpZENlbGxzLnB1c2goW3gsIHldKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsaWRDZWxscztcbn1cblxuZnVuY3Rpb24gZ2V0Q2VsbHNWYWxpZEZvclNoaXBUaHJlZSgpIHtcbiAgY29uc3QgdmFsaWRDZWxscyA9IFtdO1xuXG4gIGZvciAobGV0IHggPSAxOyB4IDw9IDg7IHgrKykge1xuICAgIGZvciAobGV0IHkgPSAxOyB5IDw9IDEwOyB5KyspIHtcbiAgICAgIHZhbGlkQ2VsbHMucHVzaChbeCwgeV0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWxpZENlbGxzO1xufVxuXG5mdW5jdGlvbiBnZXRDZWxsc1ZhbGlkRm9yU2hpcFR3bygpIHtcbiAgY29uc3QgdmFsaWRDZWxscyA9IFtdO1xuXG4gIGZvciAobGV0IHggPSAxOyB4IDw9IDk7IHgrKykge1xuICAgIGZvciAobGV0IHkgPSAxOyB5IDw9IDEwOyB5KyspIHtcbiAgICAgIHZhbGlkQ2VsbHMucHVzaChbeCwgeV0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWxpZENlbGxzO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxCb2FyZCgpIHtcbiAgY29uc3QgYWxsQm9hcmQgPSBbXTtcblxuICBmb3IgKGxldCB4ID0gMTsgeCA8PSAxMDsgeCsrKSB7XG4gICAgZm9yIChsZXQgeSA9IDE7IHkgPD0gMTA7IHkrKykge1xuICAgICAgYWxsQm9hcmQucHVzaChbeCwgeV0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhbGxCb2FyZDtcbn1cblxuZXhwb3J0IHsgdmFsaWRhdGVSZWxhdGl2ZVNoaXBQbGFjZW1lbnQsIGdldFZhbGlkUGxhY2VtZW50Q2VsbHMgfTtcbiIsImZ1bmN0aW9uIGdldENlbGxzU3Vycm91bmRpbmdDZWxsKGNlbGwpIHtcbiAgLy8gSXQgbWF5IHJldHVybiBuZWdhdGl2ZSBjZWxscyB0aGF0IGFyZSBub3Qgb24gYm9hcmQsXG4gIC8vIGJ1dCBpdCBkb2Vzbid0IG1hdHRlciBzaW5jZSB0aGV5IGFyZSBub3QgdXNlZCBhdCBhbGxcbiAgLy8gQWxsIHdlIG5lZWQgdG8gY2hlY2sgaXMgd2hldGhlciB3ZSBjYW4gcGxhY2UgYSBzaGlwIG9uXG4gIC8vIGFuIGV4aXN0aW5nIGNlbGwgb3Igbm90XG4gIHJldHVybiBbXG4gICAgLy8gcmV0dXJuIGV2ZXJ5dGhpbmcgYXJvdW5kIHRoaXMgY2VsbFxuXG4gICAgLy8gYWJvdmVcbiAgICBbY2VsbFswXSAtIDEsIGNlbGxbMV0gLSAxXSxcbiAgICBbY2VsbFswXSwgY2VsbFsxXSAtIDFdLFxuICAgIFtjZWxsWzBdICsgMSwgY2VsbFsxXSAtIDFdLFxuXG4gICAgLy8gcmlnaHRcbiAgICBbY2VsbFswXSArIDEsIGNlbGxbMV1dLFxuICAgIC8vbGVmdFxuICAgIFtjZWxsWzBdIC0gMSwgY2VsbFsxXV0sXG5cbiAgICAvLyBiZWxvd1xuICAgIFtjZWxsWzBdIC0gMSwgY2VsbFsxXSArIDFdLFxuICAgIFtjZWxsWzBdLCBjZWxsWzFdICsgMV0sXG4gICAgW2NlbGxbMF0gKyAxLCBjZWxsWzFdICsgMV0sXG4gIF07XG59XG5cbmZ1bmN0aW9uIGdldFBlcnBlbmRpY3VsYXJDZWxscyhjZWxsKSB7XG4gIGxldCBjZWxsQWJvdmU7XG4gIGxldCBjZWxsQmVsb3c7XG4gIGxldCBjZWxsVG9UaGVMZWZ0O1xuICBsZXQgY2VsbFRvVGhlUmlnaHQ7XG4gIGxldCBwZXJwZW5kaWN1bGFyQ2VsbHMgPSBbXTtcblxuICBpZiAoY2VsbFsxXSA+IDEpIHtcbiAgICBjZWxsQWJvdmUgPSBbTnVtYmVyKGNlbGxbMF0pLCBOdW1iZXIoY2VsbFsxXSkgLSAxXTtcbiAgICBwZXJwZW5kaWN1bGFyQ2VsbHMucHVzaChjZWxsQWJvdmUpO1xuICB9XG5cbiAgaWYgKGNlbGxbMV0gPCAxMCkge1xuICAgIGNlbGxCZWxvdyA9IFtOdW1iZXIoY2VsbFswXSksIE51bWJlcihjZWxsWzFdKSArIDFdO1xuICAgIHBlcnBlbmRpY3VsYXJDZWxscy5wdXNoKGNlbGxCZWxvdyk7XG4gIH1cblxuICBpZiAoY2VsbFswXSA8IDEwKSB7XG4gICAgY2VsbFRvVGhlUmlnaHQgPSBbTnVtYmVyKGNlbGxbMF0pICsgMSwgTnVtYmVyKGNlbGxbMV0pXTtcbiAgICBwZXJwZW5kaWN1bGFyQ2VsbHMucHVzaChjZWxsVG9UaGVSaWdodCk7XG4gIH1cblxuICBpZiAoY2VsbFswXSA+IDEpIHtcbiAgICBjZWxsVG9UaGVMZWZ0ID0gW051bWJlcihjZWxsWzBdKSAtIDEsIE51bWJlcihjZWxsWzFdKV07XG4gICAgcGVycGVuZGljdWxhckNlbGxzLnB1c2goY2VsbFRvVGhlTGVmdCk7XG4gIH1cblxuICByZXR1cm4gWy4uLnBlcnBlbmRpY3VsYXJDZWxsc107XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUVsZW1lbnRzKGFycikge1xuICByZXR1cm4gYXJyLm1hcCgoZWwpID0+IGVsLnRvU3RyaW5nKCkpO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0RWxlbWVudHNUb051bWJlcnMoYXJyKSB7XG4gIHJldHVybiBhcnIubWFwKChlbCkgPT4gTnVtYmVyKGVsKSk7XG59XG5cbmZ1bmN0aW9uIGdldENlbGxzU3Vycm91bmRpbmdTaGlwKHNoaXBDb29yZGluYXRlcykge1xuICBjb25zdCBjZWxsc1N1cnJvdW5kaW5nU2hpcCA9IHNoaXBDb29yZGluYXRlcy5tYXAoZ2V0Q2VsbHNTdXJyb3VuZGluZ0NlbGwpLmZsYXQoKTtcblxuICByZXR1cm4gY2VsbHNTdXJyb3VuZGluZ1NoaXA7XG59XG5cbmV4cG9ydCB7XG4gIGdldENlbGxzU3Vycm91bmRpbmdDZWxsLFxuICBnZXRQZXJwZW5kaWN1bGFyQ2VsbHMsXG4gIHN0cmluZ2lmeUVsZW1lbnRzLFxuICBjb252ZXJ0RWxlbWVudHNUb051bWJlcnMsXG4gIGdldENlbGxzU3Vycm91bmRpbmdTaGlwLFxufTtcbiIsImltcG9ydCB7IGNvbnZlcnRFbGVtZW50c1RvTnVtYmVycyB9IGZyb20gJy4vaGVscGVyJztcblxuY29uc3QgSW5wdXQgPSAoKCkgPT4ge1xuICBsZXQgX2xhc3RNb3ZlO1xuICBsZXQgX3NoaXBzID0gW107IC8vdHdvLWRpbWVuc2lvbmFsLlxuXG4gIGZ1bmN0aW9uIHNldExhc3RNb3ZlKGNvb3JkaW5hdGUpIHtcbiAgICBfbGFzdE1vdmUgPSBjb252ZXJ0RWxlbWVudHNUb051bWJlcnMoY29vcmRpbmF0ZSk7XG4gICAgY29uc29sZS5sb2coX2xhc3RNb3ZlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExhc3RNb3ZlKCkge1xuICAgIHJldHVybiBfbGFzdE1vdmU7XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXBzKHNoaXBzKSB7XG4gICAgX3NoaXBzLnB1c2goc2hpcHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGxheWVyU2hpcHMoKSB7XG4gICAgcmV0dXJuIF9zaGlwc1swXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENvbXB1dGVyU2hpcHMoKSB7XG4gICAgcmV0dXJuIF9zaGlwc1sxXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgIF9sYXN0TW92ZSA9IG51bGw7XG4gICAgX3NoaXBzID0gW107XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHNldExhc3RNb3ZlLFxuICAgIGdldExhc3RNb3ZlLFxuICAgIGdldFBsYXllclNoaXBzLFxuICAgIGdldENvbXB1dGVyU2hpcHMsXG4gICAgcGxhY2VTaGlwcyxcbiAgICBjbGVhcixcbiAgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IElucHV0O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQge1xuICBmaWxsQmF0dGxlZmllbGRzV2l0aENlbGxzLFxuICBjbGVhckJhdHRsZWZpZWxkcyxcbiAgc2hvd1BsYXllclNoaXBzLFxufSBmcm9tIFwiLi9tb2R1bGVzL2RvbS9iYXR0bGVmaWVsZFwiO1xuaW1wb3J0IHsgYWRkRXZlbnRzVG9TdGFydE1lbnVCdXR0b25zIH0gZnJvbSBcIi4vbW9kdWxlcy9kb20vc3RhcnRfbWVudVwiO1xuaW1wb3J0IHsgYWRkUmVzdGFydEV2ZW50IH0gZnJvbSBcIi4vbW9kdWxlcy9kb20vcmVzdGFydFwiO1xuXG5pbXBvcnQgVUlHYW1lU3RhdGUgZnJvbSBcIi4vbW9kdWxlcy9kb20vZ2FtZV9zdGF0ZVwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4vbW9kdWxlcy9nYW1lXCI7XG5pbXBvcnQgSW5wdXQgZnJvbSBcIi4vbW9kdWxlcy91dGlscy9pbnB1dFwiO1xuaW1wb3J0IGdlbmVyYXRlU2hpcHNGb3JCb3RoUGxheWVycyBmcm9tIFwiLi9tb2R1bGVzL3JhbmRvbV9zaGlwc1wiO1xuXG4oKCkgPT4ge1xuICBpbml0R2FtZSgpO1xuICBhZGRSZXN0YXJ0RXZlbnQocmVjZWl2ZVJlc3RhcnQpO1xufSkoKTtcblxuZnVuY3Rpb24gaW5pdEdhbWUoKSB7XG4gIElucHV0LmNsZWFyKCk7XG4gIC8qIFVwZGF0ZSBiYXR0bGVmaWVsZHMgKi9cbiAgY2xlYXJCYXR0bGVmaWVsZHMoKTtcbiAgZmlsbEJhdHRsZWZpZWxkc1dpdGhDZWxscygpO1xuXG4gIGdlbmVyYXRlU2hpcHNGb3JCb3RoUGxheWVycygpO1xuICBzaG93UGxheWVyU2hpcHMoKTtcblxuICBhZGRFdmVudHNUb1N0YXJ0TWVudUJ1dHRvbnMocmVjZWl2ZVN0YXJ0LCByZWNlaXZlUmFuZG9tKTtcbn1cblxuZnVuY3Rpb24gcmVjZWl2ZVN0YXJ0KCkge1xuICBHYW1lLnN0YXJ0KCk7XG59XG5cbmZ1bmN0aW9uIHJlY2VpdmVSZXN0YXJ0KCkge1xuICBVSUdhbWVTdGF0ZS50b2dnbGVSZXN1bHQoKTtcbiAgVUlHYW1lU3RhdGUuc2hvd1Jlc3RhcnQoKTtcbiAgaW5pdEdhbWUoKTtcbn1cblxuZnVuY3Rpb24gcmVjZWl2ZVJhbmRvbSgpIHtcbiAgSW5wdXQuY2xlYXIoKTtcbiAgY2xlYXJCYXR0bGVmaWVsZHMoKTtcbiAgZmlsbEJhdHRsZWZpZWxkc1dpdGhDZWxscygpO1xuICBnZW5lcmF0ZVNoaXBzRm9yQm90aFBsYXllcnMoKTtcbiAgc2hvd1BsYXllclNoaXBzKCk7XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9