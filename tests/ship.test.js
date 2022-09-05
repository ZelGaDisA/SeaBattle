import Ship from '../src/modules/ship';

test('ship hit is marked', () => {
  const coordinates = [
    [6, 1],
    [6, 2],
    [6, 3],
    [6, 4],
  ];
  const ship = new Ship(...coordinates); // create a ship with length 4

  ship.hit(2); // hit the third position

  expect(ship.getPosition(2)).toHaveProperty('isHit', true);
});

test('creates an extended ship that has coordinates', () => {
  const coordinates = [
    [6, 1],
    [6, 2],
    [6, 3],
    [6, 4],
  ];
  const ship = new Ship(...coordinates); // create a ship with length 4

  expect(ship.getCoordinates()).toEqual(coordinates);
});

test('ship is sunk when all positions are hit', () => {
  const coordinates = [
    [6, 1],
    [6, 2],
    [6, 3],
    [6, 4],
  ];
  const ship = new Ship(...coordinates);

  for (let i = 0; i < coordinates.length; i++) {
    ship.hit(i);
  }

  expect(ship.isSunk()).toBeTruthy();
});
