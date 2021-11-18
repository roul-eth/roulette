// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @custom:security-contact mouradif@devhunt.eu
interface IRouletteSpinCasino is IERC20 {
    function mint(address to, uint256 amount) external;
    function mintTable(uint256 initialAmount) external returns (address);
    function deposit(address fromPlayer, uint256 amount) external;
    function fund(address toTable, uint256 amount) external;
}