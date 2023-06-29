// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

// Looks up Visuals by ID and converts them to IDs

contract VisualsRegistry {
    enum VisualsCat {
        BODY,
        HAT,
        EYES,
        MOUTH,
        NOSE,
        LIMBS,
        TAIL,
        MISC
    }

    mapping(VisualsCat => bytes32[]) public Visuals;

    function registerVisual(VisualsCat category, bytes32 svg) public returns (uint256) {
        Visuals[category].push(svg);
        return Visuals[category].length - 1;
    }
}
