//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "../interfaces/ICasino.sol";

import {PokeMeReady} from "./PokeMeReady.sol";

contract RandomNumberConsumer is Ownable, VRFConsumerBase, PokeMeReady {
    bytes32 internal keyHash;
    uint256 internal fee;
    address public casinoAddr;
    uint256 currentRound;

    bool public betsPresent; //should not be	public, temporary only
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

    event	casinoAddressChanged(address oldAddr, address newAddr);
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

    function setCasinoAddress(address _casinoAddr) public onlyOwner {
	   require(_casinoAddr != address(0));
	   address oldAddr = casinoAddr;
	   casinoAddr = _casinoAddr;
	   emit casinoAddressChanged(oldAddr, _casinoAddr);
    }

    /**
	* Requests randomness
	*/
    //need to use modifier onlyPokeMe to allow only calls from GELATO
    function getRandomNumber() external	returns (bytes32 requestId)
    {
	   require(
		  LINK.balanceOf(address(this)) >=	fee,
		  "Not enough LINK - fill contract"
	   );
	   require(
		  ((block.timestamp	- lastExecuted) > 180),
		  "Counter: increaseCount: Time not elapsed"
	   );
	   require(
		  (RNGPending == false),
		  "Still waiting for a RNG."
	   );
	   
	   currentRound++;
	   lastExecuted = block.timestamp;
	   RNGPending = true;
	   drawings.push(currentRound);
	   
	   drawingsDetails[currentRound].roundId = currentRound;
	   drawingsDetails[currentRound].lastExecuted = lastExecuted; 

	   return	requestRandomness(keyHash, fee);
    }

    /**
	* Callback function	used	by VRF Coordinator
	*/
    function fulfillRandomness(bytes32 requestId,	uint256 randomness)	internal override
    {
		lastReturned =	block.timestamp;
	   
		drawingsDetails[currentRound].lastReturned =	lastReturned;
		drawingsDetails[currentRound].randomNumber =	randomness;
		betsPresent = false;
		RNGPending = false;

	   /*ICasino(casinoAddr).updateRandomNumber(
		  currentRound,
		  requestId,
		  randomness
	   );*/
    }

	function getDrawings() public	view	returns (uint[] memory)
    {
	return drawings;
    }
    
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
