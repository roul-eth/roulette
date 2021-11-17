// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

abstract contract PokeMeReady {
    address payable public immutable pokeMe;

    constructor(address payable _pokeMe) {
        pokeMe = _pokeMe;
    }

    modifier onlyPokeMe() {
        require(msg.sender == pokeMe, "PokeMeReady: onlyPokeMe");
        _;
    }
}