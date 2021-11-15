//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "../interfaces/ICasino.sol";
import "../interfaces/IRNG.sol";

contract Casino is ICasino, Ownable {
    IRNG internal randomGenerator;

    // round => randomSeed
    mapping(uint256 => uint256) public randomSeeds;
    bytes32 internal requestId;

    event ResponseReceived(uint256 round, bytes32 requestId, uint256 response);
    event RandomNumberRequest(uint256 round, bytes32 requestId);

    modifier onlyRNG() {
        require(msg.sender == address(randomGenerator), "Only RNG address");
        _;
    }

    constructor(address _rng) {
        randomGenerator = IRNG(_rng);
    }

    /**
     * @dev Should be called by gelato to request a random number to the next game round.
     * @param _round game round the random number is for
     */
    // TODO: use a modifier so that it accepts calls from gelato only
    function requestRandomNumber(uint256 _round) external {
        requestId = randomGenerator.getRandomNumber(_round);
        // Emits that random number has been requested
        emit RandomNumberRequest(_round, requestId);
    }

    /**
     * @notice Callback function called by the RNG contract after receiving the chainlink response.
     * @param _round game round the random number is for
     * @param _requestId ID of the request that was sent to the RNG contract
     * @param _randomNumber Random number provided by the VRF chainlink oracle
     */
    function updateRandomNumber(
        uint256 _round,
        bytes32 _requestId,
        uint256 _randomNumber
    ) external onlyRNG {
        randomSeeds[_round] = _randomNumber;
        emit ResponseReceived(_round, _requestId, _randomNumber);
    }
}
