const { randomBytes } = require('crypto');

let RNC;
let nextRandomNumber;

async function waitForRandomNumber() {
  return new Promise(res => RNC.once('ResponseReceived', res));
}

async function generateRandomNumber() {
  const value = nextRandomNumber ?? randomBytes(32);
  nextRandomNumber = undefined;
  await RNC.mockRandomness(value);
}

function forceNextRandomNumber(n) {
  nextRandomNumber = n;
}

const start = (_RNC) => {
  RNC = _RNC;
  RNC.on('RandomNumberRequest', generateRandomNumber);
}

const stop = () => {
  RNC.off('RandomNumberRequest', generateRandomNumber);
}

module.exports = {
  start,
  stop,
  waitForRandomNumber,
  forceNextRandomNumber
};