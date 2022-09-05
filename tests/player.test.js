import { Player } from '../src/modules/player';
import { Computer } from '../src/modules/player';
import PlayerManager from '../src/modules/player_manager';
import Ship from '../src/modules/ship';

describe('Computer player', () => {
  test('computer stops attacking the ship once it is sunk', () => {
    const player = new Player('1');
    const computer = new Computer();

    player.gameboard.placeShip(new Ship([2, 2], [2, 3], [2, 4], [2, 5]));

    PlayerManager.setCurrent(computer);

    player.gameboard.receiveAttack([2, 5]); // hit a ship
    computer.tryingToSinkShip = true;
    computer.lastHitAtShip = [2, 5];
    player.gameboard.receiveAttack([2, 4]); // sink it
    player.gameboard.receiveAttack([2, 3]);
    player.gameboard.receiveAttack([2, 2]);

    computer.defineNextMove();

    expect(computer.tryingToSinkShip).toBeFalsy();
    expect(computer.lastHitAtShip).toBeFalsy();
  });

  test("Computer starts attacking a ship once it has hit one of ship's positions", () => {
    const player = new Player('1');
    const computer = new Computer();

    PlayerManager.setCurrent(computer);

    player.gameboard.placeShip(new Ship([2, 2], [2, 3], [2, 4], [2, 5]));
    player.gameboard.receiveAttack([2, 5]);

    computer.defineNextMove();

    expect(computer.tryingToSinkShip).toBeTruthy();
    expect(computer.lastHitAtShip).toBeTruthy();
  });
});
