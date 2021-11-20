const { randomBytes } = require('crypto');
const EventBus = require('./eventbus');

let RNC;
let nextRandomNumber;

async function waitForRandomNumber() {
  return new Promise(res => EventBus.on('ResponseReceived', res));
}

async function generateRandomNumber() {
  const value = nextRandomNumber ?? randomBytes(32);
  nextRandomNumber = undefined;
  await RNC.mockRandomness(value);
}

function onResponseReceived() {
  EventBus.emit('ResponseReceived');
}

function forceNextRandomNumber(n) {
  nextRandomNumber = n;
}

const start = (_RNC) => {
  RNC = _RNC;
  RNC.on('RandomNumberRequest', generateRandomNumber);
  RNC.on('ResponseReceived', onResponseReceived)
}

const stop = () => {
  RNC.off('RandomNumberRequest', generateRandomNumber);
  RNC.off('ResponseReceived', onResponseReceived)
}

module.exports = {
  start,
  stop,
  waitForRandomNumber,
  forceNextRandomNumber
};