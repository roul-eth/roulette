// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const {
  deployLibrary,
  deployRNC,
  deployNFT,
  deployCasino,
  deployGelatoMock
} = require('../utils/deployments.js');

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
}

module.exports = {
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
