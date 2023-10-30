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
        // uint256 faceTraitId = aminals.addFace(
        //     '<path d="M673 351c0 75-26 111-175 115-133 4-171-44-171-119s85-156 174-156 172 85 172 160Z" style="fill:#70968c;fill-rule:nonzero"/><path d="M659 345c0 51-24 59-163 62-123 2-159-14-159-66s76-90 159-90 163 42 163 94Z" style="fill:#438786;fill-rule:nonzero"/><circle cx="389" cy="343" r="43" style="fill:#265a5d"/><path d="M389 308a36 36 0 1 0-12 71 36 36 0 0 0 12-71Zm-1 39c-15 0-27-8-27-18s12-18 27-18 27 8 27 18-12 18-27 18Z" style="fill:#271b27;fill-rule:nonzero"/><ellipse cx="388" cy="329" rx="27" ry="18" style="fill:#2b565b"/><circle cx="369" cy="324" r="3" style="fill:#fff"/><circle cx="376" cy="319" r="2" style="fill:#fff"/><circle cx="500" cy="300" r="43" style="fill:#265a5d"/><path d="M500 265a36 36 0 1 0-12 71 36 36 0 0 0 12-71Zm-1 39c-15 0-27-8-27-18s12-18 27-18 27 8 27 18-12 18-27 18Z" style="fill:#271b27;fill-rule:nonzero"/><ellipse cx="499" cy="286" rx="27" ry="18" style="fill:#2b565b"/><circle cx="480" cy="281" r="3" style="fill:#fff"/><circle cx="486" cy="276" r="2" style="fill:#fff"/><circle cx="604" cy="343" r="43" style="fill:#265a5d"/><path d="M604 308a36 36 0 1 0-12 71 36 36 0 0 0 12-71Zm0 39c-15 0-27-8-27-18s12-18 27-18 26 8 26 18-12 18-26 18Z" style="fill:#271b27;fill-rule:nonzero"/><ellipse cx="604" cy="329" rx="27" ry="18" style="fill:#2b565b"/><circle cx="584" cy="324" r="3" style="fill:#fff"/><circle cx="591" cy="319" r="2" style="fill:#fff"/>'
        // );

        uint256 faceTraitId = 3;
        uint256 bodyTraitId = 3;
        uint256 earsTraitId = 4;
        uint256 armsTraitId = 3;
        uint256 miscTraitId = 3;
        uint256 backTraitId = 3;

        // uint256 bodyTraitId = aminals.addBody(
        //     '<path d="M710 404c0 362-94 350-210 350s-210 23-210-350c0-116 94-219 210-219s210 103 210 219z" class="st3"/><path d="M504 523c-2 3-6 3-8 0l-2-4-2-4c-2-3 0-7 4-7h8c4 0 6 4 5 7l-2 4-3 4zM504 542c-2 3-6 3-8 0l-2-4-2-4c-2-3 0-7 4-7h8c4 0 6 4 5 7l-2 4-3 4zM504 563c-2 3-6 3-8 0l-2-4-2-3c-2-4 0-8 4-8h8c4 0 6 4 5 8l-2 3-3 4zM504 504c-2 3-6 3-8 0l-2-4-2-4c-2-3 0-7 4-7h8c4 0 6 4 5 7l-2 4-3 4zM482 523c-2 3-7 3-8 0l-3-4-2-4c-2-3 1-7 4-7h9c4 0 6 4 4 7l-2 4-2 4zM482 542c-2 3-7 3-8 0l-3-4-2-4c-2-3 1-7 4-7h9c4 0 6 4 4 7l-2 4-2 4zM482 504c-2 3-7 3-8 0l-3-4-2-4c-2-3 1-7 4-7h9c4 0 6 4 4 7l-2 4-2 4zM461 504c-2 3-6 3-8 0l-2-4-3-4c-1-3 1-7 5-7h8c4 0 6 4 4 7l-2 4-2 4zM527 523c-2 3-7 3-9 0l-2-4-2-4c-2-3 1-7 4-7h9c3 0 6 4 4 7l-2 4-2 4zM527 542c-2 3-7 3-9 0l-2-4-2-4c-2-3 1-7 4-7h9c3 0 6 4 4 7l-2 4-2 4zM527 504c-2 3-7 3-9 0l-2-4-2-4c-2-3 1-7 4-7h9c3 0 6 4 4 7l-2 4-2 4zM547 504c-2 3-7 3-9 0l-2-4-2-4c-2-3 1-7 4-7h9c4 0 6 4 4 7l-2 4-2 4z" class="st7"/>'
        // );

        // uint256 earsTraitId = aminals.addEar(
        //     '<path d="M335 357c-11-23-34-144-30-163 4-17 30 24 65 63 12 13 38 37 48 55" class="st3"/><path d="M346 361c-8-17-25-107-22-121 3-13 23 18 49 46 9 10 28 28 35 41" class="st6"/><path d="M663 366c10-24 33-145 29-163s-31 24-66 62c-12 13-38 38-47 56" class="st3"/><path d="M652 370c7-18 24-108 21-122-3-13-23 18-49 47-9 9-28 28-35 41" class="st6"/>'
        // );

        // uint256 armsTraitId = aminals.addArm(
        //     '<path d="m445 742-4-31-2-16-2-14c-16-3-32-5-48-10l1 33 1 14 1 24 4 17c3 7 8 15 15 19 8 4 18 5 25 0 6-4 9-11 10-18l-1-18z" class="st4"/><path d="m387 620 2 51c16 5 32 8 48 10-2-28-5-49-11-63l-39 2z" class="st5"/><path d="M568 741a2259 2259 0 0 1 8-66c18-3 36-6 53-11l-2 36v16l-2 25c-1 6-2 12-5 18-3 8-8 16-16 21s-19 5-27 0c-6-4-10-12-10-19l1-20z" class="st4"/><path d="m630 609-2 55c-16 5-34 8-52 11 3-30 6-53 13-68l41 2z" class="st5"/><path d="m505 760-3-33a495 495 0 0 1-3-34c-15-2-29-5-43-11l1 37a844 844 0 0 0 6 60c2 8 6 16 13 21 6 4 15 5 22 0 5-4 8-12 8-19l-1-21zM557 732l-1-16-1-36c-13 7-27 11-42 15v16l-1 17-2 34v20c1 7 4 15 10 19 7 4 16 3 22-2s9-14 12-22l2-19 1-26z" class="st4"/><path d="m554 624 1 56c-13 7-27 11-42 15 1-30 2-54 7-70l34-1zM456 639l1 45c14 5 28 7 43 9-3-24-5-43-10-56l-34 2z" class="st5"/>'
        // );

        // uint256 miscTraitId = aminals.addMisc(
        //     '<path d="m502 109 16 33 36 5-26 26 6 36-32-17-32 17 6-36-26-26 36-5z" class="st13"/>'
        // );

        // uint256 backTraitId = aminals.addBackground(
        //     '<path d="M0 0h1000v1000H0z" style="fill:#e9d6a2"/><ellipse cx="500" cy="976" rx="164" ry="12" style="fill:#d7af65"/><circle cx="147" cy="907" r="44" class="st2"/><circle cx="283" cy="874" r="11" class="st2"/><circle cx="193" cy="796" r="2" class="st2"/><circle cx="77" cy="784" r="6" class="st2"/><circle cx="391" cy="828" r="6" class="st2"/><circle cx="464" cy="907" r="15" class="st2"/><circle cx="331" cy="906" r="5" class="st2"/><circle cx="574" cy="841" r="6" class="st2"/><circle cx="646" cy="824" r="17" class="st2"/><circle cx="635" cy="889" r="4" class="st2"/><circle cx="721" cy="936" r="6" class="st2"/><circle cx="764" cy="821" r="7" class="st2"/><circle cx="827" cy="782" r="16" class="st2"/><circle cx="819" cy="859" r="2" class="st2"/><circle cx="870" cy="901" r="5" class="st2"/><circle cx="50" cy="523" r="3" class="st2"/><circle cx="111" cy="566" r="3" class="st2"/><circle cx="207" cy="549" r="29" class="st2"/><circle cx="739" cy="560" r="3" class="st2"/><circle cx="767" cy="624" r="4" class="st2"/><circle cx="894" cy="600" r="40" class="st2"/><circle cx="910" cy="726" r="6" class="st2"/><circle cx="935" cy="833" r="19" class="st2"/><circle cx="182" cy="664" r="19" class="st2"/><circle cx="53" cy="869" r="5" class="st2"/><circle cx="810" cy="269" r="13" class="st2"/><circle cx="77" cy="261" r="6" class="st2"/><circle cx="130" cy="342" r="2" class="st2"/><circle cx="245" cy="719" r="5" class="st2"/><circle cx="794" cy="477" r="3" class="st2"/><circle cx="554" cy="892" r="4" class="st2"/><circle cx="931" cy="916" r="36" class="st2"/><path d="M462 674c-19 0-39 3-54 15l-7 8c-10 13-17 27-26 42-8 17-17 33-32 45-6 4-13 7-20 8-31 5-83-9-83-47 0-8 1-16 5-23 7-15 26-20 40-11 4 4 8 10 8 16 0 4-3 8-8 8-4 0-7-4-8-8 0-2-2-4-4-4-5-2-10 0-13 5-2 4-3 10-3 15v3c1 5 4 10 8 13 10 8 23 11 35 11 6 0 13 0 19-2l9-4c6-5 10-11 14-18 12-21 21-44 37-63l14-14c21-14 48-17 72-12 10 2 8 17-3 17z" class="st3"/>'
        // );

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

        visualsAuction.proposeVisual{value: 0.02 ether}(
            auctionID,
            VisualsAuction.VisualsCat.BODY,
            bodyTraitId
        );

        visualsAuction.voteVisual(
            auctionID,
            VisualsAuction.VisualsCat.BODY,
            bodyTraitId
        );

        visualsAuction.proposeVisual{value: 0.02 ether}(
            auctionID,
            VisualsAuction.VisualsCat.EARS,
            earsTraitId
        );

        visualsAuction.voteVisual(
            auctionID,
            VisualsAuction.VisualsCat.EARS,
            earsTraitId
        );

        visualsAuction.proposeVisual{value: 0.02 ether}(
            auctionID,
            VisualsAuction.VisualsCat.ARM,
            armsTraitId
        );

        visualsAuction.voteVisual(
            auctionID,
            VisualsAuction.VisualsCat.ARM,
            armsTraitId
        );

        visualsAuction.proposeVisual{value: 0.02 ether}(
            auctionID,
            VisualsAuction.VisualsCat.MISC,
            miscTraitId
        );

        visualsAuction.voteVisual(
            auctionID,
            VisualsAuction.VisualsCat.MISC,
            miscTraitId
        );

        visualsAuction.proposeVisual{value: 0.02 ether}(
            auctionID,
            VisualsAuction.VisualsCat.BACK,
            backTraitId
        );

        visualsAuction.voteVisual(
            auctionID,
            VisualsAuction.VisualsCat.BACK,
            backTraitId
        );

        visualsAuction.endAuction(auctionID);

        vm.stopBroadcast();
    }
}
