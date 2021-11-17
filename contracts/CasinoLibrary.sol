// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library CasinoLibrary {
    struct RouletteBettingSlot {
        uint8[] numbers;
        uint8 payoutMultiplier;
    }

    struct Bet {
        address from;
        uint256 amount;
        uint8 betId;
    }

    enum TableStatus {
        BetsOpen,
        BetsClosed
    }

    function isValidBetId(uint8 id) public pure returns (bool) {
        return id <= 40;
    }

    function RBSSingleNumber(uint8 number) public pure returns (RouletteBettingSlot memory rbs) {
        require(number < 37, "That number will never be drawn");
        uint8[] memory numbers;
        numbers[0] = number;
        return RouletteBettingSlot(numbers, 36);
    }

    function RBSRed() public pure returns (RouletteBettingSlot memory rbs) {
        uint8[] memory numbers;
        numbers[0] = 1;
        numbers[1] = 3;
        numbers[2] = 5;
        numbers[3] = 7;
        numbers[4] = 9;
        numbers[5] = 12;
        numbers[6] = 14;
        numbers[7] = 16;
        numbers[8] = 18;
        numbers[9] = 19;
        numbers[10] = 21;
        numbers[11] = 23;
        numbers[12] = 25;
        numbers[13] = 27;
        numbers[14] = 30;
        numbers[15] = 32;
        numbers[16] = 34;
        numbers[17] = 36;
        return RouletteBettingSlot(numbers, 2);
    }

    function RBSBlack() public pure returns (RouletteBettingSlot memory rbs) {
        uint8[] memory numbers;
        numbers[0] = 2;
        numbers[1] = 4;
        numbers[2] = 6;
        numbers[3] = 8;
        numbers[4] = 10;
        numbers[5] = 11;
        numbers[6] = 13;
        numbers[7] = 15;
        numbers[8] = 17;
        numbers[9] = 20;
        numbers[10] = 22;
        numbers[11] = 24;
        numbers[12] = 26;
        numbers[13] = 28;
        numbers[14] = 29;
        numbers[15] = 31;
        numbers[16] = 33;
        numbers[17] = 35;
        return RouletteBettingSlot(numbers, 2);
    }

    function RBSOdd() public pure returns (RouletteBettingSlot memory rbs) {
        uint8[] memory numbers;
        numbers[0] = 1;
        numbers[1] = 3;
        numbers[2] = 5;
        numbers[3] = 7;
        numbers[4] = 9;
        numbers[5] = 11;
        numbers[6] = 13;
        numbers[7] = 15;
        numbers[8] = 17;
        numbers[9] = 19;
        numbers[10] = 21;
        numbers[11] = 23;
        numbers[12] = 25;
        numbers[13] = 27;
        numbers[14] = 29;
        numbers[15] = 31;
        numbers[16] = 33;
        numbers[17] = 35;
        return RouletteBettingSlot(numbers, 2);
    }

    function RBSEven() public pure returns (RouletteBettingSlot memory rbs) {
        uint8[] memory numbers;
        numbers[0] = 2;
        numbers[1] = 4;
        numbers[2] = 6;
        numbers[3] = 8;
        numbers[4] = 10;
        numbers[5] = 11;
        numbers[6] = 13;
        numbers[7] = 15;
        numbers[8] = 17;
        numbers[9] = 20;
        numbers[10] = 22;
        numbers[11] = 24;
        numbers[12] = 26;
        numbers[13] = 28;
        numbers[14] = 29;
        numbers[15] = 31;
        numbers[16] = 33;
        numbers[17] = 35;
        return RouletteBettingSlot(numbers, 2);
    }

    function RBS(uint8 id) public pure returns (RouletteBettingSlot memory rbs) {
        require(isValidBetId(id), "Found an invalid Betting ID");
        if (id < 37) return RBSSingleNumber(id);
        if (id == 37) return RBSRed();
        if (id == 38) return RBSBlack();
        if (id == 39) return RBSOdd();
        if (id == 40) return RBSEven();
    }
}
