// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

interface IResolver {
    function checker()
        external
        view
        returns (bool canExec, bytes memory execPayload);
}