//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRNG {
    /**
     * Requests randomness for a given lottery id
     */
    function getRandomNumber() external;
        
}
