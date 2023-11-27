// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {Aminals} from "src/Aminals.sol";
import {VisualsAuction} from "src/utils/VisualsAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {NFTDescriptor} from "src/nft/NFTDescriptor.sol";

contract AminalForkTest is Test {
    uint256 internal sepoliaFork;

    Aminals aminals = Aminals(0x24BEd8962601Caa39e51F02bdC0251Ae51FF0d70);
    VisualsAuction visualsAuction = VisualsAuction(aminals.visualsAuction());
    AminalProposals proposals = AminalProposals(aminals.proposals());

    function setUp() public {
        string memory sepoliaRPC = vm.envString("SEPOLIA_RPC_URL");
        sepoliaFork = vm.createSelectFork(sepoliaRPC);
        // Roll to the block of Aminals contract creation
        vm.rollFork(4_597_442);
    }

    function test_Renderer() public {
        aminals.tokenURI(3);
        aminals.tokenURI(4);
    }
}
