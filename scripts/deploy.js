// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const { ethers } = require("hardhat");
const hre = require("hardhat");
const timer = ms => new Promise(res => setTimeout(res, ms));

deployRNG = async () => {
  const Randomness = await hre.ethers.getContractFactory("RandomNumberConsumer");
  _vrfCoordinator = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B"
  _linkToken = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"
  _keyHash = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311"
  _fee = ethers.utils.parseEther("0.1"); // 0.1 LINK
  _pokeMe = "0x8c089073A9594a4FB03Fa99feee3effF0e2Bc58a";
  randomness = await Randomness.deploy(_vrfCoordinator,_linkToken,_keyHash,_fee, _pokeMe);
  console.log("RNG deployed to:", randomness.address);
 
  /*await timer(60000); // wait so the etherscan index can be updated, then verify the contract code
    await hre.run("verify:verify", {
      address: randomness.address,
      constructorArguments: [_vrfCoordinator,
        _linkToken,
        _keyHash,
        _fee],
    });*/
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

/*deployRouletteTable = async () => {
  const RouletteTable = await hre.ethers.getContractFactory("RouletteTable");
  await rouletteTable.deploy();
console.log("RouletteSpinCasino deployed to:", casinoFactory.address);
};*/
async function main() {

  /*  
sobe RNG - 
rouletteSpin -> precisa RNG
roulettetable
rng.setCasinoAddress(address _casinoAddr)
*/
  await deployRNG();
  await deployCasinoFactory();

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
