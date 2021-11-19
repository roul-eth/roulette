//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "../interfaces/IRouletteSpinCasino.sol";

import {PokeMeReady} from "./PokeMeReady.sol";

contract RandomNumberConsumer is Ownable, VRFConsumerBase, PokeMeReady {
    bytes32 internal keyHash;
    uint256 internal fee;
    address public casinoAddr;
    uint256 currentRound;
	uint gelatoInterval = 30;

    bool public betsPresent; //should not be public, temporary only
    bool public RNGPending;
    uint public lastExecuted;
    uint lastReturned;
		 
    //temporary only, for debugging purposes
    uint[] drawings; 
    struct drawingDetail	{
	   uint roundId;
	   uint lastExecuted;
	   uint lastReturned;
	   uint randomNumber;
    }
    mapping (uint => drawingDetail) public drawingsDetails;

    event casinoAddressChanged(address oldAddr, address newAddr);
   	event RandomNumberRequest(uint256 round, bytes32 requestId);
	event ResponseReceived(uint256 round, bytes32 requestId);
    
    modifier onlyCasino() {
	   require(msg.sender == casinoAddr, "Casino calls only");
	   _;
    }

/*construct with
    0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
    0x01BE23585060835E02B77ef475b0Cc51aA1e0709
    0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
    100000000000000000
    0x8c089073A9594a4FB03Fa99feee3effF0e2Bc58a
    
    after constructing, need to send LINK to contract
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
	   address oldAddr = casinoAddr;
	   casinoAddr = _casinoAddr;
	   emit casinoAddressChanged(oldAddr, _casinoAddr);
    }

	function setGelatoInterval(uint _interval) public onlyOwner {
		require(_interval > 30, "Interval must be greater than 30");
		gelatoInterval = _interval;
	}
    
	/**
	* Requests randomness
	*/
    //need to use modifier onlyPokeMe to allow only calls from GELATO
	//need to uncomment the LINK require below (disabled for testing)
    function getRandomNumber() external	{
	   /*require(
		  (LINK.balanceOf(address(this)) >=	fee),
		  "Not enough LINK - fill contract"
	   );*/
	   require(
		  ((block.timestamp	- lastExecuted) >= gelatoInterval),
		  "Time for next gelato job not elapsed"
	   );
	   require(
		  (RNGPending == false),
		  "Still waiting for a RNG."
	   );
	   require(betsPresent == true, "Bets must be present to request RNG");
	   
	   currentRound++;
	   lastExecuted = block.timestamp;
	   RNGPending = true;
	   drawings.push(currentRound);
	   
	   drawingsDetails[currentRound].roundId = currentRound;
	   drawingsDetails[currentRound].lastExecuted = lastExecuted; 

	   bytes32 requestId = requestRandomness(keyHash, fee);
	   //bytes32 requestId = 0x1234567890123456789012345678901234567890123456789012345678901234;
	   emit RandomNumberRequest(currentRound, requestId);
    }

    /**
	* Callback function	used by VRF Coordinator
	*/
    function fulfillRandomness(bytes32 requestId,uint256 randomness) internal override
    {
		require(RNGPending == true, "No RNG pending");
		lastReturned =	block.timestamp;
	   
		drawingsDetails[currentRound].lastReturned =	lastReturned;
		drawingsDetails[currentRound].randomNumber =	randomness;
		betsPresent = false;
		RNGPending = false;

		emit ResponseReceived(currentRound, requestId);
	   
	   //TODO: Must check this
	   //IRouletteSpinCasino(casinoAddr).updateRandomNumber(currentRound,randomness);
    }

	//Temporary function, must be removed
	function forceRandom(bytes32 requestId,uint256 randomness) public onlyOwner 
    {
		require(RNGPending == true, "No RNG pending");
		lastReturned =	block.timestamp;
	   
		drawingsDetails[currentRound].lastReturned =	lastReturned;
		drawingsDetails[currentRound].randomNumber =	randomness;
		betsPresent = false;
		RNGPending = false;

		emit ResponseReceived(currentRound, requestId);
	   
	   //TODO: Must check this
	   IRouletteSpinCasino(casinoAddr).updateRandomNumber(currentRound,randomness);
    }

	//Debugging function
	function getDrawings() public view returns (uint[] memory)
    {
		return drawings;
    }
    
   //Debugging function
   function setBetsPresent() public {
	  betsPresent = true;
   }

    /**
	* Function to allow	removing LINK from the contract
	*/
    function withdrawLink(uint256 amount) external onlyOwner {
	   LINK.transfer(msg.sender, amount);
    }
}
