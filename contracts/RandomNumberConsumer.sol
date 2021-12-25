// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./PokeMeReady.sol";
import "../interfaces/IRNC.sol";
import "../interfaces/IRouletteSpinCasino.sol";

contract RandomNumberConsumer is IRNC, Ownable, VRFConsumerBase, PokeMeReady {
    bytes32 internal keyHash;
    uint256 internal fee;
    IRouletteSpinCasino public casinoAddr;
    uint8 gelatoInterval = 30;

    uint256 currentRound;

    bool betsPresent;
    bool RNGPending;
    uint256 lastExecuted;
    mapping(address => bool) private isTable;
    mapping(uint256 => uint256) private history;

    bool debug = true;

    //temporary only, for debugging purposes

    event TableAddressAdded(address tableAddress);
    event CasinoAddressChanged(address oldAddr, address newAddr);
    event RandomNumberRequest(uint256 round, bytes32 requestId);
    event ResponseReceived(uint256 round, bytes32 requestId);
	
    modifier onlyCasino() {
        require((msg.sender == address(casinoAddr) || msg.sender == owner()), "Casino calls only");
        _;
    }

    modifier onlyTable() {
        require((isTable[msg.sender] || msg.sender == owner()), "Table calls only");
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
        address payable _pokeMe
    ) VRFConsumerBase(_vrfCoordinator, _linkToken) PokeMeReady(_pokeMe) {
        keyHash = _keyHash;
        fee = _fee;
    }

    /*
        Must be called after deployment, with the RouletteSpinCasino address, so it can call the function to get the random number
    */
    function setCasinoAddress(address _casinoAddr) public onlyOwner {
        require(_casinoAddr != address(0));
        address oldAddr = address(casinoAddr);
        casinoAddr = IRouletteSpinCasino(_casinoAddr);
        emit CasinoAddressChanged(oldAddr, _casinoAddr);
    }

    function setTable(address tableAddress) public onlyCasino {
        require(tableAddress != address(0));
        isTable[tableAddress] = true;
        emit TableAddressAdded(tableAddress);
    }

    function setGelatoInterval(uint8 _interval) public onlyOwner {
        require(_interval > 30, "Interval must be greater than 30");
        gelatoInterval = _interval;
    }

    function getLastExecuted() public view returns (uint256) {
        return lastExecuted;
    }

     function getBetsPresent() external view returns (bool) {
        return betsPresent;
    }

 function setLastExecuted() external {
        lastExecuted = block.timestamp;
    }
    /**
     * Called by gelato to execute pending actions: finish the current round, start a new round, or request
     * a random number.
     //NEED TO PUT OnlyPokeMe again
     */
    function updateGameState() external {
        bytes32 requestId;
        if (!RNGPending) {
            if (betsPresent) {
                lastExecuted = block.timestamp;
                RNGPending = true;

                requestId = debug
                    ? bytes32(0x0)
                    : requestRandomness(keyHash, fee);
                emit RandomNumberRequest(currentRound, requestId);
            } else {
                // reverting only to signal Gelato that the task should not run
                //should be worked out, loophole bug with bets taking long to run
                revert("No bets present");
                
            }
        } else {
            require(history[currentRound] != 0, "Still waiting for a RNG");
            RNGPending = false;
            betsPresent = false;
            casinoAddr.payBets(currentRound, history[currentRound]);
            currentRound++;
			lastExecuted = block.timestamp;
        }
    }

    /**
     * Callback function used by VRF Coordinator
     * 
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        require(RNGPending == true, "No RNG pending");
        history[currentRound] = randomness;

        emit ResponseReceived(currentRound, requestId);
    }

    function mockRandomness(uint256 randomness) public {
        fulfillRandomness(bytes32(abi.encodePacked("Random")), randomness);
    }

    function setBetsPresent() public {
        require(!RNGPending, "Bets are closed");
        betsPresent = true;
    }

    function getRoundRandomness(uint256 _roundId)
        public
        view
        onlyTable
        returns (uint256)
    {
        return history[_roundId];
    }

    function isDebug() public view returns (bool) {
        return debug;
    }

    function isRNGPending() public view onlyOwner returns (bool) {
        return RNGPending;
    }

    function setDebug(bool _debug) public onlyOwner {
        debug = _debug;
    }
    /**
     * Function to allow	removing LINK from the contract
     */
    function withdrawLink(uint256 amount) external onlyOwner {
        LINK.transfer(msg.sender, amount);
    }

    function getCurrentRound() public view returns (uint256) {
        return currentRound;
    }
}
