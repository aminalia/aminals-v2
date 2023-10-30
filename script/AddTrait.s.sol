pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {Aminals} from "src/Aminals.sol";
import {IAminal} from "src/IAminal.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {VisualsAuction} from "src/utils/VisualsAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";

/*
forge script script/AminalScript.s.sol:AminalScript --broadcast --verify -vvvv
 
forge script script/AminalScript.s.sol:AminalScript --chain-id 5  --rpc-url "https://goerli.blockpi.network/v1/rpc/public" --broadcast  --verify -vvvv

*/

contract AminalScript is Script {
    Aminals aminals;
    IAminalStructs.Visuals[] initialVisuals;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        Aminals aminals = Aminals(0xC4956868cB2603E8d13BD064Bb1c53C6b5044a38);
        VisualsAuction visualsAuction = VisualsAuction(
            aminals.visualsAuction()
        );

        // first aminal
        uint256 faceTraitId = aminals.addFace(
            '<path d="M673 351c0 75-26 111-175 115-133 4-171-44-171-119s85-156 174-156 172 85 172 160Z" style="fill:#70968c;fill-rule:nonzero"/><path d="M659 345c0 51-24 59-163 62-123 2-159-14-159-66s76-90 159-90 163 42 163 94Z" style="fill:#438786;fill-rule:nonzero"/><circle cx="389" cy="343" r="43" style="fill:#265a5d"/><path d="M389 308a36 36 0 1 0-12 71 36 36 0 0 0 12-71Zm-1 39c-15 0-27-8-27-18s12-18 27-18 27 8 27 18-12 18-27 18Z" style="fill:#271b27;fill-rule:nonzero"/><ellipse cx="388" cy="329" rx="27" ry="18" style="fill:#2b565b"/><circle cx="369" cy="324" r="3" style="fill:#fff"/><circle cx="376" cy="319" r="2" style="fill:#fff"/><circle cx="500" cy="300" r="43" style="fill:#265a5d"/><path d="M500 265a36 36 0 1 0-12 71 36 36 0 0 0 12-71Zm-1 39c-15 0-27-8-27-18s12-18 27-18 27 8 27 18-12 18-27 18Z" style="fill:#271b27;fill-rule:nonzero"/><ellipse cx="499" cy="286" rx="27" ry="18" style="fill:#2b565b"/><circle cx="480" cy="281" r="3" style="fill:#fff"/><circle cx="486" cy="276" r="2" style="fill:#fff"/><circle cx="604" cy="343" r="43" style="fill:#265a5d"/><path d="M604 308a36 36 0 1 0-12 71 36 36 0 0 0 12-71Zm0 39c-15 0-27-8-27-18s12-18 27-18 26 8 26 18-12 18-26 18Z" style="fill:#271b27;fill-rule:nonzero"/><ellipse cx="604" cy="329" rx="27" ry="18" style="fill:#2b565b"/><circle cx="584" cy="324" r="3" style="fill:#fff"/><circle cx="591" cy="319" r="2" style="fill:#fff"/>'
        );

        for (uint256 i = 1; i <= 2; i++) {
            console.log(
                "Aminal love by ID by user: ",
                aminals.getAminalLoveByIdByUser(
                    i,
                    0x1f028f240A90414211425bFa38eB4917Cb32c39C
                )
            );
            console.log("Aminal love total : ", aminals.getAminalLoveTotal(i));
        }

        aminals.breedWith{value: 0.01 ether}(1, 2);
        uint256 auctionID = aminals.breedWith{value: 0.01 ether}(2, 1);

        visualsAuction.proposeVisual{value: 0.02 ether}(
            auctionID,
            VisualsAuction.VisualsCat.FACE,
            faceTraitId
        );

        visualsAuction.voteVisual(
            auctionID,
            VisualsAuction.VisualsCat.FACE,
            faceTraitId
        );

        visualsAuction.endAuction(auctionID);

        vm.stopBroadcast();
    }
}
