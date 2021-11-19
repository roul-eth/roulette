// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const { ethers } = require("hardhat");
const hre = require("hardhat");
const timer = ms => new Promise(res => setTimeout(res, ms));
const Config = require('../config');

deployRNG = async () => {
  const Randomness = await hre.ethers.getContractFactory("RandomNumberConsumer");
  _fee = ethers.utils.parseEther("0.1"); // 0.1 LINK
  randomness = await Randomness.deploy(Config.VRFCoordinator,Config.LINKTToken,Config.KeyHash,_fee, Config.PokeMe);
  console.log("RNG deployed to:", randomness.address);
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
};

deployCasinoFactory = async () => {
  const library = await hre.ethers.getContractFactory("CasinoLibrary");
  const lib = await library.deploy();
  console.log("CasinoLibrary deployed to:", lib.address);

  const CasinoFactory = await hre.ethers.getContractFactory("RouletteSpinCasino", {
    libraries: {
      CasinoLibrary: lib.address,
    },
  });
  casinoFactory = await CasinoFactory.deploy(randomness.address);
  console.log("RouletteSpinCasino deployed to:", casinoFactory.address);

  await randomness.setCasinoAddress(casinoFactory.address);

};

async function main() {

  await deployRNG();
  await deployCasinoFactory();

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
