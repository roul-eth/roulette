//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRNG {
    /**
     * Requests randomness for a given lottery id
     */
    struct drawingDetail	{
	   uint roundId;
	   uint lastExecuted;
	   uint lastReturned;
	   uint randomNumber;
    }
    
    function transferRandom(uint _roundId) external view returns (drawingDetail memory dDetail);
        
}
