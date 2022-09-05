import { stringifyElements } from './utils/helper';

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
      (cell) => !stringifyElements(_attacks).includes(cell.toString()),
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
      stringifyElements(ship.getCoordinates()).includes(lastAttack.toString()),
    );

    return checkResult ? true : false;
  };

  this.checkLastAttackSankShip = function () {
    const lastAttack = this.getLastAttack();
    const lastShipHit = _ships.find((ship) =>
      stringifyElements(ship.getCoordinates()).includes(lastAttack.toString()),
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

export default Gameboard;
