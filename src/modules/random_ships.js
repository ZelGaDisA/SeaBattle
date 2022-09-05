import {
  validateRelativeShipPlacement,
  getValidPlacementCells,
} from './ship_validator';

import Input from './utils/input';
import Ship from './ship';

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

  Input.placeShips(readyShips);
}

function getValidShip(shipLength, allShips) {
  while (true) {
    const generatedShip = generateShip(shipLength);

    if (validateRelativeShipPlacement(generatedShip, allShips)) {
      return generatedShip;
    }
  }
}

function generateShip(shipLength) {
  const validCells = getValidPlacementCells(shipLength);

  const firstCoordinate = validCells[Math.floor(Math.random() * validCells.length)];
  const coordinateX = firstCoordinate[0];
  const coordinateY = firstCoordinate[1];

  const shipCoordinates = [[...firstCoordinate]];

  for (let i = 1; i < shipLength; i++) {
    // go from the second coordinate
    shipCoordinates.push([coordinateX + i, coordinateY]);
  }

  return new Ship(...shipCoordinates);
}

export default generateShipsForBothPlayers;
export { generateShipsRandomly };
