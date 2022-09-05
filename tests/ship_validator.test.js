import {
  validateRelativeShipPlacement,
  getValidPlacementCells,
} from '../src/modules/ship_validator';
import Ship from '../src/modules/ship';

describe('ship placement validation', () => {
  const ships = [
    new Ship([1, 2], [1, 3], [1, 4], [1, 5]),
    new Ship([3, 2], [3, 3], [3, 4]),
  ];

  test('can place ship on valid coordinates', () => {
    const ship = new Ship([6, 6], [6, 7]);

    expect(validateRelativeShipPlacement(ship, ships)).toBeTruthy();
  });

  test('cannot place a ship on another ship', () => {
    const ship = new Ship([1, 2], [1, 3]);

    expect(validateRelativeShipPlacement(ship, ships)).toBeFalsy();
  });

  test('cannot place a ship when crossing the ship', () => {
    const ship = new Ship([2, 3], [3, 3], [4, 3]);

    expect(validateRelativeShipPlacement(ship, ships)).toBeFalsy();
  });

  test('cannot place a ship adjacent to another ship of the same length', () => {
    const ship = new Ship([2, 2], [2, 3], [2, 4]);

    expect(validateRelativeShipPlacement(ship, ships)).toBeFalsy();
  });

  test('cannot place a shorter ship adjacent to a longer ship', () => {
    const ship = new Ship([2, 2], [2, 3]);

    expect(validateRelativeShipPlacement(ship, ships)).toBeFalsy();
  });

  test('cannot place a longer ship adjacent to a shorter ship', () => {
    const ship = new Ship([2, 2], [2, 3], [2, 4], [2, 5]);

    expect(validateRelativeShipPlacement(ship, ships)).toBeFalsy();
  });
});

test('validates when there are no ships on the battlefield', () => {
  const ship = new Ship([2, 2], [2, 3], [2, 4], [2, 5]);

  expect(validateRelativeShipPlacement(ship, [])).toBeTruthy();
});
