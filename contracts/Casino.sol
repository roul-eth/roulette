//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "../interfaces/ICasino.sol";

contract Casino is ICasino {
    address randomGenerator;
    mapping(uint256 => uint256) randomSeeds;

    event ResponseReceived(uint256 epoch, bytes32 requestId, uint256 response);

    modifier onlyRNG() {
        require(msg.sender == address(randomGenerator), "Only RNG address");
        _;
    }

    constructor(address _rng) {
        randomGenerator = _rng;
    }

    /**
     * @notice Callback function called by the RNG contract after receiving the chainlink response.
     * Will use the received random number to assign prizes to random participants.
     * @param _epoch ID of the lottery the random number is for
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
