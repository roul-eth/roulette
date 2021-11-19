const { expect, assert } = require("chai");
const HardHat = require("hardhat");
const Config = require('../config');

let Casino;
let Table;
let signers;

before(async () => {
  signers = await HardHat.ethers.getSigners();

  const RNGFactory = await hre.ethers.getContractFactory("RandomNumberConsumer");
  const RNG = await RNGFactory.deploy(
    Config.VRFCoordinator,
    Config.LINKTToken,
    Config.KeyHash,
    hre.ethers.utils.parseEther("0.1"),
    Config.PokeMe)
  const TableNFTFactory = await hre.ethers.getContractFactory("TableNFT");
  const TableNFT = await TableNFTFactory.deploy()

  const CasinoLibraryFactory = await HardHat.ethers.getContractFactory("CasinoLibrary");
  const CasinoLibrary = await CasinoLibraryFactory.deploy();
  await CasinoLibrary.deployed();

  const RouletteSpinCasinoFactory = await HardHat.ethers.getContractFactory("RouletteSpinCasino", {
    libraries: {
      CasinoLibrary: CasinoLibrary.address
    }
  });
  Casino = await RouletteSpinCasinoFactory.deploy(RNG.address, TableNFT.address)
  await TableNFT.setMinter(Casino.address);
  await Casino.mint(signers[1].address, 1000);
  const transaction = await Casino.connect(signers[1]).mintTable(500);
  const result = await transaction.wait();
  const tableCreationEvent = result.events.find(e => e.event === 'TableCreated');
  const tableAddress = '0x' + tableCreationEvent.data.slice(-40);
  const RouletteTableFactory = await HardHat.ethers.getContractFactory("RouletteTable", {
    libraries: {
      CasinoLibrary: CasinoLibrary.address
    }
  });
  Table = await RouletteTableFactory.attach(tableAddress);
})

describe('Table status', () => {
  it("Has no bets when freshly minted", async () => {
    const bets = await Table.getBets();
    console.log({bets});
    expect(await Table.getBets()).to.have.lengthOf(0);
  });

  it("Refuses invalid bets", async () => {
    const expectedError = `VM Exception while processing transaction: reverted with reason string 'Found an invalid Betting ID'`;
    try {
      await Table.connect(signers[1]).bet([
        [
          signers[1].address,
          10,
          42
        ]
      ]);
      assert.fail('No error thrown', `expected error: ${expectedError}`);
    } catch (e) {
      expect(e.message).to.equal(expectedError);
    }
  });

  it("Accepts valid bets", async () => {
    await Table.connect(signers[1]).bet([
      [
        signers[1].address,
        10,
        33
      ]
    ])
  });

  it("Refuses bets that make break the maxPayout", async () => {
    const expectedError = `VM Exception while processing transaction: reverted with reason string 'We can't afford to pay you if you win'`;
    try {
      await Table.connect(signers[1]).bet([
        [
          signers[1].address,
          200,
          33
        ]
      ])
      assert.fail('No error thrown', `expected error: ${expectedError}`);
    } catch (e) {
      expect(e.message).to.equal(expectedError);
    }
  });
});