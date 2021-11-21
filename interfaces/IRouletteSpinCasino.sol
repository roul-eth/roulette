// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @custom:security-contact mouradif@devhunt.eu
interface IRouletteSpinCasino is IERC20 {
    event TableCreated(address tableAddress);

    function mint(address to, uint256 amount) external;

    function mintTable(uint256 initialAmount) external;

    function deposit(address fromPlayer, uint256 amount) external;

    function bet(address fromPlayer, uint256 amount) external;

    function payBets(uint256 round, uint256 randomness) external;
}
