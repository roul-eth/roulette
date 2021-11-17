pragma solidity >=0.8.9;

//SPDX-License-Identifier: MIT

interface ICasino {
    //-------------------------------------------------------------------------
    // STATE MODIFYING FUNCTIONS
    //-------------------------------------------------------------------------

    function updateRandomNumber(
        uint256 _round,
        bytes32 _requestId,
        uint256 _randomNumber
    ) external;
}
