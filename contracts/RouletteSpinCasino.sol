// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RouletteTable.sol";
import "../interfaces/IRouletteSpinCasino.sol";
import "../interfaces/IRNG.sol";
//import "./CasinoLibrary.sol";

/// @custom:security-contact mouradif@devhunt.eu
contract RouletteSpinCasino is IRouletteSpinCasino, ERC20, ERC20Burnable, Ownable {
    mapping(bytes32 => RouletteTable) private _tables;
    mapping(address => bool) private _isTable;
    address[] private _tableAddresses;
    IRNG internal randomGenerator;
    address public rngAddress;
    
    modifier onlyRNG() {
        require(msg.sender == address(randomGenerator), "Only RNG address");
        _;
    }

    constructor(address _rng) ERC20("Roulette Spin", "RSPN") {
        rngAddress = _rng;
        randomGenerator = IRNG(_rng);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    // TODO: Remove this function in prod
    function publicMint() public {
        _mint(msg.sender, 500);
    }

    function mintTable(uint256 initialAmount) public returns (address) {
        require(initialAmount > 0, "You need to stake some funds in that table");
        RouletteTable table = new RouletteTable(msg.sender, address(this));
        address tableAddress = address(table);
        _transfer(msg.sender, tableAddress, initialAmount);
        _isTable[tableAddress] = true;
        _tableAddresses.push(tableAddress);
        table.mint(msg.sender, 0);
        return address(table);
    }

    function getTables() public view returns (address[] memory) {
        return _tableAddresses;
    }
    
    function deposit(address fromPlayer, uint256 amount) public {
        require(_isTable[msg.sender], "Only roulette tables can call this method");
        RouletteTable table = RouletteTable(msg.sender);
        require(table.operator() == msg.sender, "You shouldn't fund other people's table...");
        _transfer(fromPlayer, msg.sender, amount);
    }
    
    function fund(address toTable, uint256 amount) public {
        require(_isTable[toTable], "Only roulette tables can be funded");
        RouletteTable table = RouletteTable(toTable);
        require(table.operator() == msg.sender, "That's not your table");
        _transfer(msg.sender, toTable, amount);
    }

    function getWinningNumber(uint _roundId) public view returns (uint[] memory) {
     
        IRNG.drawingDetail memory dDetail = randomGenerator.transferRandom(_roundId);
        uint tableCount = _tableAddresses.length;
        uint[] memory tRNumbers = new uint[](tableCount);
        
        for (uint i=0; i<_tableAddresses.length; i++) {
            tRNumbers[i] = uint(keccak256(abi.encodePacked(dDetail.randomNumber, _tableAddresses[i]))) % 37;
        }
        
        return tRNumbers;
	}
        
}
