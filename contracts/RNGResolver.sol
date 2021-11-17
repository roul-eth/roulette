// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import {IResolver} from "../interfaces/IResolver.sol";

interface IRNG {
    function lastExecuted() external view returns (uint);
    function betsPresent() external view returns (bool);
    function getRandomNumber() external;
}

contract RNGResolver is IResolver {
    // solhint-disable var-name-mixedcase
    address public immutable RNGAdd;

    //construct with RNG.sol deployed address
    constructor(address _rng) {
        RNGAdd = _rng;
    }

    function checker() external view override returns (bool canExec, bytes memory execPayload)
    {
        uint lastExecuted = IRNG(RNGAdd).lastExecuted();
        bool betsPresent = IRNG(RNGAdd).betsPresent();

        // solhint-disable not-rely-on-time
        canExec = (((block.timestamp - lastExecuted) > 180) && (betsPresent));

        execPayload = abi.encodeWithSelector(IRNG.getRandomNumber.selector);
    }
}