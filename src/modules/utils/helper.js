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

export {
  getCellsSurroundingCell,
  getPerpendicularCells,
  stringifyElements,
  convertElementsToNumbers,
  getCellsSurroundingShip,
};
