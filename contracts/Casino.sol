//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "../interfaces/ICasino.sol";
import "../interfaces/IRNG.sol";

contract Casino is ICasino, Ownable {
    IRNG internal randomGenerator;

    // epoch => randomSeed
    mapping(uint256 => uint256) public randomSeeds;
    bytes32 internal requestId;

    event ResponseReceived(uint256 epoch, bytes32 requestId, uint256 response);
    event RandomNumberRequest(uint256 lotteryId, bytes32 requestId);

    modifier onlyRNG() {
        require(msg.sender == address(randomGenerator), "Only RNG address");
        _;
    }

    constructor(address _rng) {
        randomGenerator = IRNG(_rng);
    }

    /**
     * @dev Should be called by gelato to request a random number to the next game epoch.
     * @param _epoch epoch the random number is for
     */
    // TODO: use a modifier so that it accepts calls from gelato only
    function requestRandomNumber(uint256 _epoch) external {
        requestId = randomGenerator.getRandomNumber(_epoch);
        // Emits that random number has been requested
        emit RandomNumberRequest(_epoch, requestId);
    }

    /**
     * @notice Callback function called by the RNG contract after receiving the chainlink response.
     * @param _epoch epoch the random number is for
     * @param _requestId ID of the request that was sent to the RNG contract
     * @param _randomNumber Random number provided by the VRF chainlink oracle
     */
    function updateRandomNumber(
        uint256 _epoch,
        bytes32 _requestId,
        uint256 _randomNumber
    ) external onlyRNG {
        randomSeeds[_epoch] = _randomNumber;
        emit ResponseReceived(_epoch, _requestId, _randomNumber);
    }
}
