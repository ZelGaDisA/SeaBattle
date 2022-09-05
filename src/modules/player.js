import Gameboard from './gameboard';
import PlayerManager from './player_manager';
import { getPerpendicularCells } from './utils/helper';
import { stringifyElements } from './utils/helper';

class Player {
  #gameboard;
  #name;

  constructor(name) {
    this.#name = name;
    this.#gameboard = new Gameboard();
    PlayerManager.addPlayer(this);
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
    const possibleAttacks = PlayerManager.getPlayerPossibleAttacks(this);

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

      allValidAttacks = stringifyElements(allValidAttacks);

      const validGuessedAttacks = attacksToValidate.filter((attack) =>
        allValidAttacks.includes(attack.toString()),
      );

      const nextAttack =
        validGuessedAttacks[Math.floor(Math.random() * validGuessedAttacks.length)];

      return nextAttack;
    } else {
      const cellsWhereMayBeShip = getPerpendicularCells(this.#lastHitAtShip); // Where there might be a ship

      allValidAttacks = stringifyElements(allValidAttacks);

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
      PlayerManager.checkLastAttackAtEnemyHitShip() &&
      !PlayerManager.checkLastAttackAtEnemySankShip()
    ) {
      this.#defineNextMoveAsShipAttack();
    } else if (PlayerManager.checkLastAttackAtEnemySankShip()) {
      this.#defineNextMoveAsRandomAttack();
    }
  }

  #defineNextMoveAsShipAttack() {
    const lastAttack = PlayerManager.getLastAttackAtEnemy();
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

export { Player, Computer };
