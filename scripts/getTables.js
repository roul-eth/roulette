const hre = require("hardhat");

async function main() {
  const [deployer, operator, thirdAccount] = await hre.ethers.getSigners();
  const library = await hre.ethers.getContractFactory("CasinoLibrary");
  const lib = await library.deploy();
  const casinoFactory = await hre.ethers.getContractFactory("RouletteSpinCasino", {
    libraries: {
      CasinoLibrary: lib.address,
    },
  });
  const Casino = await casinoFactory.deploy();
  await Casino.mint(deployer.address, 2000);
  await Casino.mint(operator.address, 2000);
  await Casino.mint(thirdAccount.address, 2000);
  const transactions = [
    await Casino.mintTable(10),
    await Casino.mintTable(10),
    await Casino.mintTable(10),
    await Casino.mintTable(10),
    await Casino.mintTable(10),
    await Casino.mintTable(10)
  ];
  await Promise.all(transactions.map(t => t.wait()));
  const tables = await Casino.getTables();
  console.log({tables});
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
