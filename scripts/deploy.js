const {
  deployLibrary,
  deployRNC,
  deployNFT,
  deployCasino,
  deployGelatoMock
} = require('../utils/deployments.js');
const fs = require('fs');
const path = require('path');


async function main() {

  const GelatoMock = await deployGelatoMock();
  const RandomNumberConsumer = await deployRNC(GelatoMock);
  const TableNFT = await deployNFT();
  const CasinoLibrary = await deployLibrary();
  const RouletteSpinCasino = await deployCasino({
    CasinoLibrary,
    RandomNumberConsumer,
    TableNFT
  });
  console.log({
    GelatoMock: GelatoMock.address,
    RandomNumberConsumer: RandomNumberConsumer.address,
    TableNFT: TableNFT.address,
    RouletteSpinCasino: RouletteSpinCasino.address,
  });
  const envFile = `
export const environment = {
  production: false,
  rncInstance: '${RandomNumberConsumer.address}',
  casinoInstance: '${RouletteSpinCasino.address}',
  tableNFTInstance: '${TableNFT.address}'
};
  `;
  await fs.promises.writeFile(path.join('.', 'web', 'roulette-web', 'src', 'environments', 'environment.hardhat.ts'), envFile);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
