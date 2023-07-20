// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Aminals.sol";
import "../src/IAminal.sol";
import "../src/utils/VisualsAuction.sol";
import "../src/proposals/AminalProposals.sol";


contract BaseTest is Test {

    function deployAminals() internal returns (address) {
        VisualsAuction _visualsAuction = new VisualsAuction();
        VoteSkill _voteSkill = new VoteSkill();
        AminalProposals _proposals = new AminalProposals();

        Aminals _aminals = new Aminals(
            address(_visualsAuction),
            address(_voteSkill),
            address(_proposals)
        );

        _visualsAuction.setup(address(_aminals));
        _voteSkill.setup(address(_aminals));
        _proposals.setup(address(_aminals));

        return address(_aminals);
    }

}

