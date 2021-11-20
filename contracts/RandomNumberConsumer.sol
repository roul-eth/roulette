// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./PokeMeReady.sol";
import "../interfaces/IRNC.sol";

contract RandomNumberConsumer is IRNC, Ownable, VRFConsumerBase, PokeMeReady {
	bytes32 internal keyHash;
	uint256 internal fee;
	address public casinoAddr;
	uint8 gelatoInterval = 30;

	uint256 currentRound;

	bool betsPresent;
	bool RNGPending;
	uint256 lastExecuted;
	mapping(address => bool) private isTable;
	mapping(uint256 => uint256) private history;

	bool debug;

	//temporary only, for debugging purposes

	event TableAddressAdded(address tableAddress);
    event CasinoAddressChanged(address oldAddr, address newAddr);
	event RandomNumberRequest(uint256 round, bytes32 requestId);
	event ResponseReceived(uint256 round, bytes32 requestId);

	modifier onlyCasino() {
		require(msg.sender == casinoAddr, "Casino calls only");
		_;
	}

	modifier onlyTable() {
		require(isTable[msg.sender], "Table calls only");
		_;
	}

	/*
    after constructing, need to send LINK to contract (CHAINLINK requirement)
    */
	constructor(
		address _vrfCoordinator,
		address _linkToken,
		bytes32 _keyHash,
		uint256 _fee,
		address payable _pokeMe,
		bool _debug
	) VRFConsumerBase(_vrfCoordinator, _linkToken) PokeMeReady(_pokeMe) {
		keyHash = _keyHash;
		fee = _fee;
		debug = _debug;
	}

	/*
        Must be called after deployment, with the RouletteSpinCasino address, so it can call the function to get the random number
    */
	function setCasinoAddress(address _casinoAddr) public onlyOwner {
		require(_casinoAddr != address(0));
		address oldAddr = casinoAddr;
		casinoAddr = _casinoAddr;
		emit CasinoAddressChanged(oldAddr, _casinoAddr);
	}

	function setTable(address tableAddress) public onlyCasino {
		require(tableAddress!= address(0));
		isTable[tableAddress] = true;
        emit TableAddressAdded(tableAddress);
	}

	function setGelatoInterval(uint8 _interval) public onlyOwner {
		require(_interval > 30, "Interval must be greater than 30");
		gelatoInterval = _interval;
	}

	/**
    * Requests randomness
    */
	function getRandomNumber() external onlyPokeMe {
		require(debug || block.timestamp - lastExecuted >= gelatoInterval,
			"Time for next gelato job not elapsed"
		);
		require(RNGPending == false, "Still waiting for a RNG.");
		require(betsPresent == true, "Bets must be present to request RNG");

		lastExecuted = block.timestamp;
		RNGPending = true;

		bytes32 requestId = debug ?
		bytes32(0x0) :
		requestRandomness(keyHash, fee);

		emit RandomNumberRequest(currentRound, requestId);
	}

	/**
    * Callback function	used by VRF Coordinator
    */
	function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override
	{
		require(RNGPending == true, "No RNG pending");
		currentRound++;

		history[currentRound] = randomness;

		betsPresent = false;
		RNGPending = false;

		emit ResponseReceived(currentRound, requestId);
	}

    function mockRandomness(uint256 randomness) public {
		fulfillRandomness(bytes32(abi.encodePacked("Random")), randomness);
	}

	function setBetsPresent() public onlyTable {
		require(!RNGPending, "Bets are closed");
		betsPresent = true;
	}

	function getRoundRandomness(uint256 roundId) public view onlyTable returns(uint256) {
		return history[roundId];
	}
	function isDebug() public view returns(bool) {
		return debug;
	}
	/**
    * Function to allow	removing LINK from the contract
    */
	function withdrawLink(uint256 amount) external onlyOwner {
		LINK.transfer(msg.sender, amount);
	}

	function getCurrentRound() public view returns(uint256) {
		return currentRound;
	}
}
