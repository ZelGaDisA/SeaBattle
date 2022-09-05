import Input from '../utils/input';
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
  const playerShipsCoordinates = Input.getPlayerShips().map((ship) =>
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

export {
  fillBattlefieldsWithCells,
  clearBattlefields,
  showMissedAttack,
  showHitAtShip,
  showSunkShip,
  showPlayerShips,
  showShip,
};
