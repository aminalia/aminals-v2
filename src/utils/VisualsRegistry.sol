// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

// Looks up Visuals by ID and converts them to IDs


contract VisualsRegistry {

    enum VisualsCat { BODY, HAT, EYES, MOUTH, NOSE, LIMBS, TAIL, MISC }

       public bytes32[] BodyVisuals;
       public bytes32[] hatVisuals;
       public bytes32[] eyesVisuals;
       public bytes32[] mouthVisuals;
       public bytes32[] noseVisuals;
       public bytes32[] limbsVisuals;
       public bytes32[] tailVisuals;
       public bytes32[] miscVisuals;

    public Visuals = [ BodyVisuals, hatVisuals, eyesVisuals, mouthVisuals, noseVisuals, limbsVisuals, tailVisuals, miscVisuals]

    function registerVisual(uint category, bytes32 svg) public returns (uint) {

       return Visuals[category].push(svg) - 1;

    }

}