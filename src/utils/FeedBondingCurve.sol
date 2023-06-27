// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

// feed function uses a negative exponential bonding curve, that starts at 0 and asymptotically goes to 100

// P(S) = C * (1 - e ** (-a * S)) where C = 100 (max value) and a = steepness (e.g. 2)

// integral :  R(S) = C * (S + e**(-a*S)/a)


function feedBondingCurve(uint256 amount, energy) public {

    //simulate 'e' with eN / eD
    uint256 eN = 271828 * 10 ** 18;
    //uint256 eD = 100000;

    uint8 C = 100; // maximum value that will never be reached
    uint8 a = 2;   // steepness of the curve
    uint256 newEnergy = C * (energy + eN ** (-a * energy) / a);

}




 function feed(uint256 aminalId) public payable {
        Aminal storage aminal = aminals[aminalId];

        // TODO: Amount of love should be on a bonding curve, not a direct
        // addition
        uint256 amount = msg.value;
        // TODO: Change adjustLove bool to a constant
        adjustLove(aminalId, uint8(amount), msg.sender, true);
        // TODO: Energy should be on a bonding curve that creates an asymptote
        // (possibly a polynomic function), not a direct addition. The bonding
        // curve should be configured so that energy should never reach 100 (the
        // max). Energy can reach 0

        // aminal.energy += uint8(amount);

        // assuming a simple bonding curve, where d(e) = (1 - e/100)**2
        aminal.energy = aminal.energy + (amount * ((1 - aminal.energy/100) ** 2));

    }