//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../contracts/CasinoLibrary.sol";

interface IRNC {
    /**
     * Requests randomness for a given lottery id
     */
    function getRoundRandomness(uint256 _roundId) external view returns (uint256);
    function updateGameState() external;
    function setBetsPresent() external;
    function setTable(address tableAddress) external;
    function getCurrentRound() external view returns (uint256);
    function getLastExecuted() external view returns (uint256);

}
