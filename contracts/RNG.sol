//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "../interfaces/ICasino.sol";

contract RandomNumberConsumer is Ownable, VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;
    address public casinoAddr;
    uint256 currentRound;

    event casinoAddressChanged(address oldAddr, address newAddr);
    modifier onlyCasino() {
        require(msg.sender == casinoAddr, "Casino calls only");
        _;
    }

    constructor(
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee
    ) VRFConsumerBase(_vrfCoordinator, _linkToken) {
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
    function getRandomNumber(uint256 round)
        public
        onlyCasino
        returns (bytes32 requestId)
    {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract"
        );
        currentRound = round;
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        ICasino(casinoAddr).updateRandomNumber(
            currentRound,
            requestId,
            randomness
        );
    }

    /**
     * Function to allow removing LINK from the contract
     */
    function withdrawLink(uint256 amount) external onlyOwner {
        LINK.transfer(msg.sender, amount);
    }
}
