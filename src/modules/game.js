import PlayerManager from './player_manager';
import Input from './utils/input';
import Ship from './ship';
import UIGameState from './dom/game_state';
import generateShipsForBothPlayers from './random_ships';
import { showHitAtShip, showMissedAttack, showSunkShip } from './dom/battlefield';
import { Computer, Player } from './player';
import { getCellsSurroundingShip } from './utils/helper';

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
    Input.clear();
  }

  function _initPlayers() {
    player = new Player('player');
    computer = new Computer('computer');

    PlayerManager.addPlayer(player);
    PlayerManager.addPlayer(computer);
    PlayerManager.setCurrent(player);
  }

  function _initUI() {
    UIGameState.startGame();
  }

  async function _gameloop() {
    while (_gameGoing) {
      await nextMove();

      const attacker = PlayerManager.getCurrent();
      const attacked = PlayerManager.getNotCurrent();

      if (!attacked.gameboard.checkLastAttackSuccessful()) {
        continue;
      }

      if (!attacked.gameboard.checkLastAttackHitShip()) {
        /* If the last attack did not hit a ship */
        PlayerManager.toggleCurrent();
        UIGameState.toggleCurrentPlayer();

        showMissedAttack(attacked.gameboard.getLastAttack(), attacked.name);
      } else {
        showHitAtShip(attacked.gameboard.getLastAttack(), attacked.name);
      }

      if (attacked.gameboard.checkLastAttackSankShip()) {
        const sunkShip = attacked.gameboard.getLastAttackedShip();

        _attackCellsAroundSunkShip(attacked, sunkShip);
        showSunkShip(
          sunkShip.getCoordinates(),
          PlayerManager.getPlayerName(attacked),
        );
      }

      if (attacked.isGameOver()) {
        _stop();
        _winner = attacker;

        UIGameState.stopGame();
        setTimeout(() => {
          UIGameState.showGameResult(_winner === player ? true : false);
        }, 300);

        break;
      }
    }

    async function nextMove() {
      if (PlayerManager.getCurrent() === player) {
        await UIGameState.playerMove(player);
      } else if (PlayerManager.getCurrent() === computer) {
        await UIGameState.computerMove(computer);
      }
    }
  }

  function _placeShips(player, computer) {
    const playerShips = Input.getPlayerShips();
    const computerShips = Input.getComputerShips();

    playerShips.forEach((ship) => player.gameboard.placeShip(ship));
    computerShips.forEach((ship) => computer.gameboard.placeShip(ship));
  }

  function _attackCellsAroundSunkShip(attacked, sunkShip) {
    const cellsToAttack = getCellsSurroundingShip(sunkShip.getCoordinates());
    cellsToAttack.forEach((cell) => {
      attacked.gameboard.receiveAttack(cell);

      if (attacked.gameboard.checkLastAttackSuccessful()) {
        showMissedAttack(cell, PlayerManager.getPlayerName(attacked));
      }
    });

    UIGameState.removeAllMoveListeners();
  }

  return {
    start,
  };
})();

export default Game;
