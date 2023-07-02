// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";
import "forge-std/Test.sol";

import "../IAminal.sol";
import "../Aminals.sol";


contract Move2D {
    mapping (uint256 aminalId => Coordinates2D coords) public Coords2D;

    struct Coordinates2D {
        uint256 x;
        uint256 y;
    }

    function move2D (uint256 aminalID, uint256 x, uint256 y) public {
        Coords2D[aminalID].x = x;
        Coords2D[aminalID].y = y;

    }

    function getCoords (uint256 aminalID) public returns (uint256, uint256) {
        return (Coords2D[aminalID].x, Coords2D[aminalID].y);
    }

}


