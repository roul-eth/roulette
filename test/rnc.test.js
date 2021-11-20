const { expect, assert } = require("chai");
const HardHat = require("hardhat");
const {
  deployLibrary,
  deployRNC,
  deployNFT,
  deployCasino,
  deployGelatoMock
} = require('../utils/deployments.js');
const MockChainLink = require('../utils/mock.link');

let Casino;
let Table;
let signers;
let GelatoMock;
let RandomNumberConsumer;

before(async () => {
  signers = await HardHat.ethers.getSigners();

  GelatoMock = await deployGelatoMock();
  const CasinoLibrary = await deployLibrary();
  RandomNumberConsumer = await deployRNC(GelatoMock);
  const TableNFT = await deployNFT();

  Casino = await deployCasino({
    CasinoLibrary,
    RandomNumberConsumer,
    TableNFT
  })
  await Casino.deployed();
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
  MockChainLink.start(RandomNumberConsumer);
});

describe("Random Number Generator", () => {
  it('Cannot start next round if there are no bets', async () => {
    const expectedError = `VM Exception while processing transaction: reverted with reason string 'Bets must be present to request RNG'`;
    try {
      const [_, random] = await Promise.all([
        GelatoMock.startNextRound(),
        MockChainLink.waitForRandomNumber()
      ]);
      assert.fail('No error thrown', `expected error: ${expectedError}`);
    } catch (e) {
      expect(e.message).to.equal(expectedError);
    }
  });
  it('Can start next round once there is a bet', async () => {
    await Table.connect(signers[1]).bet([
      [
        signers[1].address,
        10,
        7
      ]
    ]);
    expect(await RandomNumberConsumer.getCurrentRound()).to.equal(0);
    MockChainLink.forceNextRandomNumber(7);
    const [_, random] = await Promise.all([
      GelatoMock.startNextRound(),
      MockChainLink.waitForRandomNumber()
    ]);
    expect(await RandomNumberConsumer.getCurrentRound()).to.equal(1);
    const roundResult = await Table.getRoundResult(0);
  });
})

after(() => {
  MockChainLink.stop();
})