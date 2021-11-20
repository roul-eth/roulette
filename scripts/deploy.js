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
  const webPath = path.join('.', 'web', 'roulette-web', 'src');
  await fs.promises.writeFile(path.join(webPath, 'environments', 'environment.hardhat.ts'), envFile);
  const artifactsPath = path.join('.', 'artifacts', 'contracts');
  const webAssetPath = path.join(webPath, 'assets');
  const contractsAbiFolders = await fs.promises.readdir(artifactsPath);
  const copying = [];
  for (const folder of contractsAbiFolders) {
    if (!/\.sol$/.test(folder)) continue;
    const contractAbiName = folder.split('.').slice(0, -1).join('.') + '.json';
    copying.push(fs.promises.copyFile(
      path.join(artifactsPath, folder, contractAbiName),
      path.join(webAssetPath, contractAbiName)
    ));
  }
  await Promise.all(copying);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
