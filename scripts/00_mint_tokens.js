const hre = require("hardhat");
const Config = require('../config');

async function main() {
  const [deployer, operator, thirdAccount] = await hre.ethers.getSigners();

  const RNCFactory = await hre.ethers.getContractFactory("RandomNumberConsumer");
  const RNC = await RNCFactory.deploy(
    Config.VRFCoordinator,
    Config.LINKTToken,
    Config.KeyHash,
    hre.ethers.utils.parseEther("0.1"),
    Config.PokeMe)
  const TableNFTFactory = await hre.ethers.getContractFactory("TableNFT");
  const TableNFT = await TableNFTFactory.deploy()
  const library = await hre.ethers.getContractFactory("CasinoLibrary");
  const lib = await library.deploy();
  const casinoFactory = await hre.ethers.getContractFactory("RouletteSpinCasino", {
    libraries: {
      CasinoLibrary: lib.address,
    },
  });
  const Casino = await casinoFactory.deploy(RNC.address, TableNFT.address);
  await TableNFT.setMinter(Casino.address);
  await Casino.mint(deployer.address, 2000);
  await Casino.mint(operator.address, 2000);
  await Casino.mint(thirdAccount.address, 2000);
  const transaction = await Casino.mintTable(10);
  const result = await transaction.wait();
  console.log(JSON.stringify(result, null, 2));
  const tableEvent = result.events.find(e => e.event === undefined);
  const tableAddress = tableEvent.address;
  console.log({tableAddress});
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
