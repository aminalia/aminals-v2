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

    function deployAminals() internal returns (address) {
        // The randomness source is a very high volume address on Sepolia. This
        // should be modified for other chains.
        VisualsAuction _visualsAuction =
        new VisualsAuction(address(vm.envAddress("GENERATOR_SOURCE_CONTRACT")), address(vm.envAddress("GENERATOR_SOURCE_BALANCE")));
        AminalProposals _proposals = new AminalProposals();

        Aminals _aminals = new Aminals(
            address(_visualsAuction),
            address(_proposals)
        );

        // TODO these don't seem to persist. : (
        // Set environment variables for contracts
        vm.setEnv("AMINALS_CONTRACT", vm.toString(address(_aminals)));
        vm.setEnv("AMINAL_PROPOSALS_CONTRACT", vm.toString(address(_proposals)));
        vm.setEnv("VISUALS_AUCTION_CONTRACT", vm.toString(address(_visualsAuction)));

        _visualsAuction.setup(address(_aminals));
        _proposals.setup(address(_aminals));

        return address(_aminals);
    }

    function spawnInitialAminals(Aminals aminals) internal {
        initialVisuals.push(IAminalStructs.Visuals(1, 1, 1, 1, 1, 1, 1, 1));
        initialVisuals.push(IAminalStructs.Visuals(2, 2, 2, 2, 2, 2, 2, 2));
        aminals.spawnInitialAminals(initialVisuals);
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        aminals = Aminals(deployAminals());

        // first aminal
        aminals.addBackground('<g id="BACK"><rect fill="#4e2f91" x="0" y="0" width="1000px" height="1000px"/></g>');
        aminals.addTail(
            '<path fill="#77a9da" d="m460 695-2-13c-14-2-29-5-42-9l1 29c14 4 29 5 44 6l-2-13Z"/><path fill="#77a9da" d="m465 735-4-27c-15-1-30-2-44-6v13l2 20h45Z"/><path fill="#82abdb" d="m419 735 3 15c3 7 7 13 13 17 7 4 16 4 22 0 5-3 8-9 9-15l-2-17h-45Z"/><path fill="#71a0ce" d="m414 628 2 45 42 9c-2-25-5-43-10-56l-34 2Z"/><path fill="#77a9da" d="m542 692 1-13 42-12v29c-14 5-29 7-44 10l1-14Z"/><path fill="#77a9da" d="m540 733 1-27c15-3 30-5 44-10l1 13v21l-46 3Z"/><path fill="#82abdb" d="m586 730-3 15c-2 7-6 13-12 18-6 4-15 5-22 1-5-3-9-9-10-15l1-16 46-3Z"/><path fill="#71a0ce" d="m583 622 2 45-42 12c0-24 2-43 6-56l34-1Z"/>'
        );
        aminals.addArm(
            '<path fill="#496cb4" d="M743 620c5 5 7 11 6 18l-2 6c-1 2-3 3-5 2-3-1-4-4-5-7-2-5-4-11-3-17M729 634c4 9 7 19 6 29 0 3-2 7-5 8l-5-2-3-6c-2-7-3-15-3-22M714 643c2 5 2 10 1 15-1 2-2 5-4 6l-5-2-2-5c-2-5-1-11 0-17M692 623c-4 7-6 15-6 23l1 5c1 1 3 3 5 3l4-5 5-15"/><path fill="#82abdb" d="m742 549-6-27-52 40v39c0 10 0 20 3 29 4 9 10 17 19 20 12 4 24-1 32-10 7-9 10-21 11-33 2-19-3-39-7-58Z"/><path fill="#6f9dcb" d="m709 410-20 60-2 34 35-38-13-56Z"/><path fill="#77a9da" d="m687 504-3 58 52-40-14-57-35 39Z"/><path fill="#496cb4" d="M257 623c-5 5-7 11-6 18 0 2 0 4 2 6s3 3 5 2c3-1 4-4 5-7 2-5 4-11 3-17M271 637c-4 9-7 19-6 29 0 3 2 7 5 8l5-2 3-6c2-7 3-15 3-22M286 646c-2 5-2 10-1 15 1 2 2 5 4 6l5-2 2-5c2-5 1-11 0-17M308 626c4 7 6 15 6 23l-1 5c-1 1-3 3-5 3l-4-5-5-15"/><path fill="#82abdb" d="m258 552 6-27 52 40v39c0 10 0 20-3 29-4 9-10 17-19 20-12 4-24-1-32-10-7-9-10-21-11-33-2-19 3-39 7-58Z"/><path fill="#6f9dcb" d="m291 413 20 60 2 34-35-39 13-55Z"/><path fill="#77a9da" d="m313 507 3 58-52-40 14-57 35 39Z"/>'
        );
        aminals.addEar(
            '<path fill="#e4f5fd" d="M425 234c-2-9-12-14-20-11-23 7-48 15-67 0 9-9 11-22 9-35l-4-14c-1-3-4-2-4 0 1 13 2 29-9 38l-1 1c-17-23-15-53-14-81l1-23c5 1 10 0 15-2 21-9 21-30 17-49-1-5-7-4-7 1 1 10 2 21-3 30-5 7-14 10-22 8l2-28c0-7-10-8-11-1l-8 63-2 11c-10 3-22 7-30-1-9-10-8-25-6-38l-2-3-4 2c-2 7-4 15-4 22-1 12 5 27 16 34 9 4 19 4 29 3-1 13-1 26 2 39-5 6-11 11-18 12-8 1-16-6-17-13 0-3-4-3-4 0 0 11 10 21 21 22 8 0 15-4 22-8 2 6 6 12 10 18 25 36 64 33 101 24 9-2 15-12 12-21ZM575 234c2-9 12-14 20-11 23 7 48 15 66 0-8-9-10-22-8-35l4-14c0-3 4-2 4 0-1 13-2 29 8 38l2 1c17-23 15-53 14-81l-1-23c-5 1-10 0-15-2-21-9-21-30-17-49 1-5 7-4 7 1-1 10-2 21 3 30 5 7 14 10 22 8l-2-28c0-7 10-8 11-1a136601 136601 0 0 0 10 74c10 3 22 7 30-1 9-10 8-25 6-38l2-3 4 2c2 7 4 15 4 22 1 12-5 27-16 34-9 4-19 4-29 3 1 13 1 26-2 39 5 6 11 11 18 12 8 1 16-6 17-13 0-3 4-3 4 0 0 11-10 21-21 22-8 0-15-4-22-8-2 6-6 12-10 18-25 36-64 33-101 24-9-2-15-12-12-21Z"/><path fill="#77a9da" d="M310 335c-20-17-40-45-44-63-3-18 15-46 35-44 17 1 50 18 67 31"/><path fill="#5f53a3" d="M322 329a98 98 0 0 1-32-43c-3-13 11-33 26-32 13 1 37 13 50 21"/><path fill="#77a9da" d="M683 337c21-14 44-39 50-57 6-17-9-47-29-48-18 0-52 13-70 23"/><path fill="#5f53a3" d="M672 331c15-10 32-27 36-40 4-12-7-33-22-34-14-1-39 8-52 15"/>'
        );
        aminals.addBody(
            '<path fill="#77a9da" d="M710 397c0 116-94 282-210 282S290 513 290 397s94-218 210-218 210 102 210 218Z"/><path fill="#93b0dc" d="M673 345c0 75-26 111-175 115-133 4-171-45-171-120s82-152 171-152 175 81 175 157Z"/>'
        );
        aminals.addFace(
            '<path fill="#89cfcb" d="M598 415H402c-35 0-64-29-64-64s22-139 162-69c127-70 162 34 162 69s-29 64-64 64Z"/><circle cx="611" cy="351" r="42" fill="#586b7f"/><circle cx="611" cy="351" r="24" fill="#0a3035"/><circle cx="598" cy="338" r="2" fill="#fff"/><circle cx="602" cy="335" r="1" fill="#fff"/><circle cx="389" cy="351" r="42" fill="#586b7f"/><circle cx="389" cy="351" r="24" fill="#0a3035"/><circle cx="375" cy="338" r="2" fill="#fff"/><circle cx="380" cy="335" r="1" fill="#fff"/><path fill="#ac95b8" d="M515 302c-7 12-23 12-30 0l-4-8-5-8c-6-11 1-25 14-25h19c13 0 21 14 15 25l-5 8-5 8Z"/><circle cx="495" cy="285" r="4" fill="#923018"/><circle cx="505" cy="285" r="4" fill="#923018"/>'
        );
        aminals.addMouth('<circle cx="500" cy="354" r="10" fill="#385e5d"/>');
        aminals.addMisc(
            '<path fill="#fff" d="M526 205c-24 0-44-19-44-44 0-12 4-23 12-31a44 44 0 1 0 44 73l-12 2Z"/><path fill="#fcfcfc" d="m500 549-19-34-20-34h78l-20 34-19 34z"/>'
        );

        // Second aminal
        aminals.addBackground('<g><rect fill="#00a79d" x="0" y="0" width="1000px" height="1000px"/></g>');
        aminals.addTail(
            '<path fill="#f15a29" d="M514 544c22 50 22 108 1 159-14 38-38 85-10 121 5 7 13 11 23 13 10 1 21-1 28-8 5-5 8-15 3-22-2-3-7-4-11-3-8 3-4 14 1 19 6 4 13 4 21 2 17-5 28-20 43-30 10-6 24-9 35-2-5-2-11-2-17-1-5 1-11 3-15 7-14 10-25 27-42 35-9 4-21 5-30-1-11-7-16-26-5-37 8-7 21-7 30-1 14 9 15 30 7 44-13 24-47 30-71 18-33-16-46-56-42-91 1-25 10-50 17-74 6-21 9-42 6-63-2-20-8-41-18-59l47-23Z"/>'
        );
        aminals.addArm(
            '<path fill="#e01f26" d="M293 378c-31 37-68 71-112 93 22 1 42-2 64-2-10 1-21 4-31 9l42-5-35 28 33-16-26 21c5-1 9-4 14-7l-24 17c-6 4-19 12-27 13 20-1 41-5 60-13-12 8-23 19-33 30l30-20c-10 8-19 19-26 31l26-24c-14 13-22 35-32 51l47-47c-16 25-26 53-33 83 8-18 18-35 33-49-15 58-13 114 2 172-1-19 0-39 5-58 6 62 27 119 61 172-22-62-35-125-38-192 6 21 12 42 20 63l-4-99c4 16 9 28 19 42-9-32-14-64-12-98 4 14 8 28 20 38-13-30-19-60-18-94 4 18 10 36 16 53 0-40 2-79 8-119l12 42c1-19 3-38 7-56M707 378c31 37 68 71 112 93-22 1-42-2-64-2 10 1 21 4 31 9l-42-5 35 28-33-16 26 21c-5-1-9-4-14-7l24 17c6 4 19 12 27 13-20-1-41-5-60-13 12 8 23 19 33 30l-30-20c10 8 19 19 26 31l-26-24c14 13 22 35 32 51l-47-47c16 25 26 53 33 83-8-18-18-35-33-49 15 58 13 114-2 172 1-19 0-39-5-58-6 62-27 119-61 172 22-62 35-125 38-192-6 21-12 42-20 63l4-99c-4 16-9 28-19 42 9-32 14-64 12-98-4 14-8 28-20 38 13-30 19-60 18-94-4 18-10 36-16 53 0-40-2-79-8-119l-12 42c-1-19-3-38-7-56"/>'
        );
        aminals.addEar(
            '<path fill="#e01f26" d="M335 346c-19-63-24-132-12-198 33 43 71 83 114 117"/><path fill="#b22024" d="M340 287c-5-16-8-33-7-50l4 8v-39c12 16 28 31 46 41"/><path fill="#e01f26" d="M665 342c19-63 24-132 12-198-33 43-71 83-114 117"/><path fill="#b22024" d="M660 283c5-16 8-33 7-50l-4 8v-39c-12 16-28 31-46 41"/>'
        );
        aminals.addBody(
            '<path fill="#e01f26" d="M710 398c0 116-94 281-210 281S290 514 290 398s94-218 210-218 210 102 210 218Z"/><circle cx="500" cy="375" r="188" fill="#e01f26"/><path fill="#e01f26" d="m312 518 52 185v-44c10 24 28 46 50 63l-15-38c15 16 27 35 37 54-2-15 1-31 8-45 2 10 7 20 14 29l-2-22 29 19c-2-6-3-13-1-20l11 23 12-25v56l35-64 2 34c5-14 13-28 24-40l-1 37 57-83-3 33c31-57 52-118 63-181l-5 4"/>'
        );
        aminals.addFace(
            '<rect width="323" height="126" x="338" y="289" fill="#eba220" rx="63" ry="63"/><circle cx="388" cy="352" r="41" fill="#f5d235"/><circle cx="388" cy="352" r="38" fill="#0a3035"/><circle cx="367" cy="331" r="3" fill="#fff"/><circle cx="374" cy="325" r="1" fill="#fff"/><circle cx="612" cy="352" r="41" fill="#e01f26"/><circle cx="612" cy="352" r="38" fill="#0a3035"/><circle cx="590" cy="331" r="3" fill="#fff"/><circle cx="597" cy="325" r="1" fill="#fff"/><g fill="#923018"><circle cx="495" cy="307" r="3"/><circle cx="505" cy="307" r="3"/></g>'
        );
        aminals.addMouth(
            '<rect width="77" height="45" x="461" y="335" fill="#0a3035" rx="22" ry="22"/><path fill="#fffbd0" d="M492 336c0 2-2 5-5 5s-5-2-5-5M518 336c0 2-2 5-5 5s-5-2-5-5"/><circle cx="499" cy="364" r="13" fill="#001a2a"/><path fill="#7c0506" d="M485 380c0-8 7-12 14-12s14 4 14 12"/><path fill="#1c4349" d="m474 350-4 8 1 9M481 351l-4 8c0 3 0 6 2 8M523 350l4 8-1 9M516 351l4 8c0 3 0 6-2 8"/><path fill="#eba220" d="m530 17-51 83-8-20 81 9-67 78-9-20 66 5 17 1-77 60 54-59 4 11-96 8 71-83 8 20-84-9 89-84Z"/>'
        );
        aminals.addMisc("");

        spawnInitialAminals(aminals);

        vm.stopBroadcast();
    }
}

// TODO what if invalid visuals get included - how to validate and ignore
