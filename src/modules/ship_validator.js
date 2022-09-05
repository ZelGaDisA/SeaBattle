import { getCellsSurroundingShip, stringifyElements } from './utils/helper';

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

export default validateShipPlacement;

function validateRelativeShipPlacement(validatedShip, allShips) {
  /* Validate against other ships */

  const shipCells = stringifyElements(validatedShip.getCoordinates());

  const adjacentShipCoordinates = stringifyElements(
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
      return getCellsSurroundingShip(shipCoordinates);
    })
    .flat();

  allShips.forEach((ship) => {
    const shipCoordinates = ship.getCoordinates();
    shipCoordinates.forEach((coordinate) =>
      adjacentShipCoordinates.push(stringifyElements(coordinate)),
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

export { validateRelativeShipPlacement, getValidPlacementCells };
