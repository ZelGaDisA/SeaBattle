import { convertElementsToNumbers } from './helper';

const Input = (() => {
  let _lastMove;
  let _ships = []; //two-dimensional.

  function setLastMove(coordinate) {
    _lastMove = convertElementsToNumbers(coordinate);
    console.log(_lastMove);
  }

  function getLastMove() {
    return _lastMove;
  }

  function placeShips(ships) {
    _ships.push(ships);
  }

  function getPlayerShips() {
    return _ships[0];
  }

  function getComputerShips() {
    return _ships[1];
  }

  function clear() {
    _lastMove = null;
    _ships = [];
  }

  return {
    setLastMove,
    getLastMove,
    getPlayerShips,
    getComputerShips,
    placeShips,
    clear,
  };
})();

export default Input;
