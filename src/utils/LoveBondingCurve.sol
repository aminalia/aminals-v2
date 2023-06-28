// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "../Aminals.sol";

contract LoveBondingCurve {
    Aminals public aminals;

    constructor(address _aminals) {
        // TODO: Replace with Aminals contract address
        aminals = Aminals(_aminals);
    }
    // TODO: Add bonding curve for how love is allocated

    // TODO: Add a price per love for different actions based on the current level
    // of love on the bonding curve

    function loveDrivenPrice(uint256 aminalId) public view returns (uint128) {
        // the higher the love, the cheaper the function calls
        //
       // Aminals.Aminal storage aminal = aminals.aminals[aminalId];
       // Aminals.Aminal storage aminal = aminals.getAminalById(aminalId);
        uint128 price;
        uint256 love = aminals.getAminalLoveByIdByUser(aminalId, msg.sender);
        uint256 totlove = aminals.getAminalLoveTotal(aminalId);
        uint256 ratio = love / totlove;
        if (ratio == 0) price = 100; // max multiplier is 100;

        else price = uint128(100 / ratio);
        // ensure that price is between 1 and 10;
        price = price / 10;
        if (price < 1) price++;

        return price;
    }
}
