require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();

const parseNetworks = require('./utils/env.networks');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("round", "Triggers the next round")
  .addParam("gelato", "The GelatoMock address")
  .setAction(async ({gelato}) => {
    const GelatoFactory = await hre.ethers.getContractFactory("GelatoMock");
    const Gelato = await GelatoFactory.attach(gelato);
    const tx = await Gelato.startNextRound();
    console.log({tx});
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10
      }
    }
  },
  etherscan: (Object.prototype.hasOwnProperty.call(process.env, 'ETHERSCAN_KEY')) ? {
    apiKey: process.env.ETHERSCAN_KEY
  } : undefined,
  gasReporter: (Object.prototype.hasOwnProperty.call(process.env, 'COINMARKETCAP_KEY')) ? {
    enabled: true,
    currency: "USD",
    coinmarketcap: `${process.env.COINMARKETCAP_KEY}`
  }: undefined,
  // networks: parseNetworks(process.env)
  networks: {
    development: {
      url: `http://127.0.0.1:7545`,
      accounts: [`85cedcb9661a29cfa8f80ab535a45ec3fdce31e55ad69a21faee0051cbf1f547`],
    }
  }
};
