// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "../Aminals.sol";

contract LoveBondingCurve {
    Aminals public aminalz;

    constructor() {
        // TODO: Replace with Aminals contract address
        aminalz = new Aminals();
    }
    // TODO: Add bonding curve for how love is allocated

    // TODO: Add a price per love for different actions based on the current level
    // of love on the bonding curve

    function loveDrivenPrice(uint256 aminalId) public view returns (uint128) {
        // the higher the love, the cheaper the function calls
        //
        Aminals.Aminal storage aminal = aminalz.aminals(aminalId);
        uint128 price;
        uint256 love = aminal.lovePerUser[msg.sender];
        uint128 totlove = aminal.totalLove;
        uint128 ratio = love / totlove;
        if (ratio == 0) price = 100; // max multiplier is 100;

        else price = 100 / ratio;
        // ensure that price is between 1 and 10;
        price = price / 10;
        if (price < 1) price++;

        return price;
    }
}
