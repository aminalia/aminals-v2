// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

contract FeedBondingCurve {
    // feed function uses a negative exponential bonding curve, that starts at 0 and asymptotically goes to 100

    // P(S) = C * (1 - e ** (-a * S)) where C = 100 (max value) and a = steepness (e.g. 2)

    // integral :  R(S) = C * (S + e**(-a*S)/a)

    function feedBondingCurve(int256 amount, int256 energy) public {
        //simulate 'e' with eN / eD
        int256 eN = 271828 * 10 ** 18;
        //uint256 eD = 100000;

        int8 C = 100; // maximum value that will never be reached
        int8 a = 2; // steepness of the curve
        int256 newEnergy = C * (energy + eN ** (-a * energy) / a);
    }
}
