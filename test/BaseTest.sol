// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {Aminals} from "src/Aminals.sol";
import {IAminal} from "src/IAminal.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {VisualsAuction} from "src/utils/VisualsAuction.sol";

contract BaseTest is Test {
    IAminalStructs.Visuals[] initialVisuals;

    function deployAminals() internal returns (address) {
        VisualsAuction _visualsAuction = new VisualsAuction();
        AminalProposals _proposals = new AminalProposals();

        Aminals _aminals = new Aminals(
            address(_visualsAuction),
            address(_proposals)
        );

        _visualsAuction.setup(address(_aminals));
        _proposals.setup(address(_aminals));

        return address(_aminals);
    }

    function spawnInitialAminals(Aminals aminals) internal {
        initialVisuals.push(IAminalStructs.Visuals(1, 1, 1, 1, 1, 1, 1, 1));
        initialVisuals.push(IAminalStructs.Visuals(2, 2, 2, 2, 2, 2, 2, 2));
        aminals.spawnInitialAminals(initialVisuals);
    }
}
