// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RouletteTable.sol";
import "../interfaces/IRouletteSpinCasino.sol";
import "../interfaces/IRNC.sol";
import "../interfaces/ITableNFT.sol";

contract RouletteSpinCasino is
    IRouletteSpinCasino,
    ERC20,
    ERC20Burnable,
    Ownable
{
    mapping(bytes32 => RouletteTable) private _tables;
    mapping(address => bool) private _isTable;
    address[] private _tableAddresses;
    IRNC internal randomNumberConsumer;
    ITableNFT internal tableNFT;

    event winningNumberDrawn(uint256 round, uint8 winningNumber);

    modifier onlyRNC() {
        require(msg.sender == address(randomNumberConsumer), "Only RNC calls");
        _;
    }

    constructor(address _rnc, address _tableNFT)
        ERC20("Roulette Spin", "RSPN")
    {
        tableNFT = ITableNFT(_tableNFT);
        randomNumberConsumer = IRNC(_rnc);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // TODO: Remove this function in prod
    function publicMint() public {
        _mint(msg.sender, 500);
    }

    function mintTable(uint256 initialAmount) public {
        require(
            initialAmount > 0,
            "You need to stake some funds in that table"
        );
        tableNFT.safeMint(msg.sender);
        RouletteTable table = new RouletteTable(
            msg.sender,
            address(this),
            address(randomNumberConsumer)
        );
        address tableAddress = address(table);
        randomNumberConsumer.setTable(tableAddress);
        _transfer(msg.sender, tableAddress, initialAmount);
        _isTable[tableAddress] = true;
        _tableAddresses.push(tableAddress);
        emit TableCreated(tableAddress);
    }

    function getTables() public view returns (address[] memory) {
        return _tableAddresses;
    }

    function deposit(address fromPlayer, uint256 amount) public {
        require(
            _isTable[msg.sender],
            "Only roulette tables can call this method"
        );
        RouletteTable table = RouletteTable(msg.sender);
        require(
            table.operator() == msg.sender,
            "You shouldn't fund other people's table..."
        );
        _transfer(fromPlayer, msg.sender, amount);
    }

    function bet(address fromPlayer, uint256 amount) public {
        require(
            _isTable[msg.sender],
            "Only roulette tables can call this method"
        );
        _transfer(fromPlayer, msg.sender, amount);
    }

    function payBets(uint256 _roundId, uint256 randomness) public onlyRNC {
        uint8 draw = uint8(randomness % 37);
       
        for (uint256 i = 0; i < _tableAddresses.length; i++) {
            RouletteTable table = RouletteTable(_tableAddresses[i]);
            CasinoLibrary.Bet[] memory bets = table.getBets(_roundId);
            for (uint256 j = 0; j < bets.length; j++) {
                CasinoLibrary.Bet memory playerBet = bets[j];
                uint8 payout = CasinoLibrary.isWinningBet(
                    playerBet.betId,
                    draw
                );
                if (payout > 0) {
                    _transfer(
                        address(table),
                        playerBet.from,
                        playerBet.amount * payout
                    );
                }
            }
        }
        emit winningNumberDrawn(_roundId, draw);
    }
}
