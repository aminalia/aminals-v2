pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {Aminal} from "src/Aminal.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";

contract EndAuction is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));
        GeneAuction geneAuction = GeneAuction(factory.geneAuction());

        // Display info for existing Aminals
        for (uint256 i = 0; i < factory.totalAminals() && i < 2; i++) {
            address aminalAddress = factory.aminalsByIndex(i);
            Aminal aminal = Aminal(payable(aminalAddress));

            console.log("Aminal Address:", aminalAddress);
            console.log("Aminal love by user:", aminal.getLoveByUser(address(vm.envAddress("ADDRESS"))));
            console.log("Aminal total love:", aminal.getTotalLove());
        }

        // End a specific auction (replace 3 with actual auction ID)
        uint256 auctionId = 3;
        console.log("Ending auction ID:", auctionId);

        // Note: This will depend on the specific auction implementation
        // The Gene Auction system may have different methods than the old VisualsAuction

        // Check auction status first
        geneAuction.settleAuction(auctionId);

        console.log("Note: Gene Auction system implementation may differ from VisualsAuction");
        console.log("Please verify auction methods before running this script");

        vm.stopBroadcast();
    }
}
