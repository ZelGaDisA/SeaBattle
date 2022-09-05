function addEventsToStartMenuButtons(startCallback, randomCallback) {
  const start = document.querySelector('.js-start');
  const random = document.querySelector('.js-random');
  start.addEventListener('click', startCallback);
  random.addEventListener('click', randomCallback);
}

export { addEventsToStartMenuButtons };
