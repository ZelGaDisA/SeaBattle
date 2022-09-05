function addRestartEvent(callback) {
  const restartBtn = document.querySelector('.js-restart');
  restartBtn.addEventListener('click', callback);
}

export { addRestartEvent };
