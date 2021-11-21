// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../interfaces/IRNC.sol";

contract GelatoMock {
    address owner;
    IRNC randomNumberConsumer;

    constructor() {
        owner = msg.sender;
    }

    function setRNC(address rnc) public {
        require(msg.sender == owner, "Only Owner");
        randomNumberConsumer = IRNC(rnc);
    }

    function startNextRound() public {
        randomNumberConsumer.updateGameState();
    }
}
