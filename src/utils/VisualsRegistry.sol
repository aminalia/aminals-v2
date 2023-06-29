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

    mapping(VisualsCat => string[]) public visuals;

    function getVisuals(uint category, uint id) public view returns (string memory) {
        if(visuals[VisualsCat(category)].length > 0) {
            return visuals[VisualsCat(category)][id];
        } else {
            return "";
        }
    }


    function registerVisual(VisualsCat category, string memory svg) public returns (uint256) {
        visuals[category].push(svg);
        return visuals[category].length;
    }
}
