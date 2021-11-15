// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const { ethers } = require("hardhat");
const hre = require("hardhat");
const CONTRACTS = require('../contracts.js')

const timer = ms => new Promise(res => setTimeout(res, ms));


deployCasino = async (randomness) => {
  casino_address = CONTRACTS[hre.network.name]["casinoAddress"]
  const Casino = await hre.ethers.getContractFactory("Casino");
  if (casino_address == "") {
    casino = await Casino.deploy(randomness.address);
    await casino.deployed();
    console.log("Casino deployed to:", casino.address);
    await timer(60000); // wait so the etherscan index can be updated, then verify the contract code
    await hre.run("verify:verify", {
      address: casino.address,
      constructorArguments: [randomness.address],
    });
    await randomness.setCasinoAddress(casino.address, { gasLimit: 4000000 })
  } else {
    casino = await Casino.attach(casino_address);
  }
  return casino
}

deployRandomness = async () => {
  rand_address = CONTRACTS[hre.network.name]["randomnessAddress"]
  const Randomness = await hre.ethers.getContractFactory("RandomNumberConsumer");
  if (rand_address == "") {
    _vrfCoordinator = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
    _linkToken = "0xa36085F69e2889c224210F603D836748e7dC0088"
    _keyHash = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
    _fee = ethers.utils.parseEther("0.1"); // 0.1 LINK
    randomness = await Randomness.deploy(_vrfCoordinator,
      _linkToken,
      _keyHash,
      _fee)
    console.log("Randomness deployed to:", randomness.address);
    await timer(60000); // wait so the etherscan index can be updated, then verify the contract code
    await hre.run("verify:verify", {
      address: randomness.address,
      constructorArguments: [_vrfCoordinator,
        _linkToken,
        _keyHash,
        _fee],
    });
    return randomness
  }
  else {
    randomness = await Randomness.attach(rand_address)
  }

  return randomness
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  //await hre.run('compile');

  const deployer = await ethers.getSigner();
  const accounts = await ethers.getSigners();


  randomness = await deployRandomness();
  casino = await deployCasino(randomness);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
