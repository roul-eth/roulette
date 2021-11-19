const { expect, assert } = require("chai");
const HardHat = require("hardhat");
const Config = require('../config');

let Casino;
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
  await Casino.deployed();
  await TableNFT.setMinter(Casino.address);
})

describe("RouletteSpinCasino initial state", () => {
  it("Has no table when freshly deployed", async () => {
    expect(await Casino.getTables()).to.have.lengthOf(0);
  });

  it("Has a totalSupply of zero", async () => {
    expect(await Casino.totalSupply()).to.equal(0);
  });

});

describe("Minting RouletteSpin Tokens", () => {

  it("Can mint token only if you're the owner", async () => {
    const expectedError = `VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'`;
    try {
      await Casino.connect(signers[1]).mint(signers[1].address, 500);
      assert.fail(null, expectedError, 'No error was thrown');
    } catch (e) {
      expect(e.message).to.equal(expectedError);
    }
    expect(await Casino.balanceOf(signers[1].address)).to.equal(0);
    const tx = await Casino.connect(signers[0]).mint(signers[1].address, 500);
    await tx.wait();
    expect(await Casino.balanceOf(signers[1].address)).to.equal(500);
  });
});

describe('Minting Roulette Tables', () => {
  it("Can mint a table with no funds", async () => {
    const expectedError = `VM Exception while processing transaction: reverted with reason string 'You need to stake some funds in that table'`;
    try {
      await Casino.mintTable(0);
      assert.fail('No error thrown', `expected error: ${expectedError}`);
    } catch (e) {
      expect(e.message).to.equal(expectedError);
    }
  });

  it("Can mint a table with the right balance", async () => {
    const expectedError = `VM Exception while processing transaction: reverted with reason string 'ERC20: transfer amount exceeds balance'`;
    try {
      await Casino.connect(signers[1]).mintTable(600);
      assert.fail('No error thrown', `expected error: ${expectedError}`);
    } catch (e) {
      expect(e.message).to.equal(expectedError);
    }
    const transaction = await Casino.connect(signers[1]).mintTable(500);
    const result = await transaction.wait();
    const tableCreationEvent = result.events.find(e => e.event === 'TableCreated');
    const tableAddress = '0x' + tableCreationEvent.data.slice(-40);
    const addresses = (await Casino.getTables()).map(a => a.toLowerCase());
    expect(addresses).to.include(tableAddress);
    expect(await Casino.balanceOf(signers[1].address)).to.equal(0);
    expect(await Casino.balanceOf(tableAddress)).to.equal(500);
  });
});