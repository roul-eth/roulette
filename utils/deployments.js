const hre = require('hardhat');
const timer = ms => new Promise(res => setTimeout(res, ms));
const Config = require('../config');

const deployGelatoMock = async () => {
  const GelatoMockFactory = await hre.ethers.getContractFactory('GelatoMock');
  const GelatoMock = await GelatoMockFactory.deploy();
  return GelatoMock;
}

const deployRNC = async (GelatoMock, address = '') => {
  const RNCFactory = await hre.ethers.getContractFactory("RandomNumberConsumer");
  const _fee = hre.ethers.utils.parseEther("0.1"); // 0.1 LINK
  const RandomNumberConsumer = (address) ?
    await RNCFactory.attach(address) :
    await RNCFactory.deploy(
    Config.VRFCoordinator,
    Config.LINKTToken,
    Config.KeyHash,_fee,
    GelatoMock?.address ?? Config.PokeMe,
    true
  );
  if (GelatoMock !== undefined)
    await GelatoMock?.setRNC(RandomNumberConsumer.address);
  /**
   * Verify the contract on etherscan

   await timer(60000); // wait so the etherscan index can be updated, then verify the contract code
   await hre.run("verify:verify", {
    address: randomness.address,
    constructorArguments: [_vrfCoordinator,
      _linkToken,
      _keyHash,
      _fee],
  });
   */
  return RandomNumberConsumer;
};

const deployNFT = async (address = '') => {
  const NFTFactory = await hre.ethers.getContractFactory("TableNFT");
  const TableNFT = address ? await NFTFactory.attach(address) : await NFTFactory.deploy();
  return TableNFT;
}

const deployLibrary = async (address = '') => {
  const LibraryFactory = await hre.ethers.getContractFactory("CasinoLibrary");
  const lib = address ?
    await LibraryFactory.attach(address) :
  await LibraryFactory.deploy();

  return lib;
}

const deployCasino = async ({
                              CasinoLibrary,
                              RandomNumberConsumer,
                              TableNFT
                            }, address = '') => {
  const CasinoFactory = await hre.ethers.getContractFactory("RouletteSpinCasino", {
    libraries: {CasinoLibrary: CasinoLibrary.address}
  });
  const casino = address ? await CasinoFactory.attach(address) : await CasinoFactory.deploy(RandomNumberConsumer.address, TableNFT.address);

  await RandomNumberConsumer.setCasinoAddress(casino.address);
  await TableNFT.setMinter(casino.address);

  return casino;
};

module.exports = {
  deployLibrary,
  deployRNC,
  deployNFT,
  deployCasino,
  deployGelatoMock
}