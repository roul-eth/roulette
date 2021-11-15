pragma solidity >=0.6.0;

//SPDX-License-Identifier: MIT

interface ICasino {
    //-------------------------------------------------------------------------
    // STATE MODIFYING FUNCTIONS
    //-------------------------------------------------------------------------

    function updateRandomNumber(
        uint256 _epoch,
        bytes32 _requestId,
        uint256 _randomNumber
    ) external;
}
