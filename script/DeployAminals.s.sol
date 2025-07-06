pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {Genes} from "src/genes/Genes.sol";
import {Move2D} from "src/skills/Move2D.sol";
import {FightSkill} from "src/skills/FightSkill.sol";
import {InitialGenesMinter} from "script/InitialGenesMinter.sol";
import {InitialGenesMinter2} from "script/InitialGenesMinter2.sol";

/*
// Mainnet
forge script script/DeployAminals.s.sol:DeployAminals --broadcast --verify -vvvv

// Goerli
forge script script/DeployAminals.s.sol:DeployAminals --chain-id 5  --rpc-url "https://goerli.blockpi.network/v1/rpc/public" --broadcast  --verify -vvvv

// Sepolia
forge script  script/DeployAminals.s.sol:DeployAminals --chain-id 11155111 --rpc-url "https://ethereum-sepolia.publicnode.com" --broadcast --verify -vvv

// Holesky
forge script  script/DeployAminals.s.sol:DeployAminals --chain-id 17000 --rpc-url "https://ethereum-holesky.publicnode.com" --broadcast --verify -vvv

forge script  script/DeployAminals.s.sol:DeployAminals --chain-id 17000 --rpc-url "https://ethereum-holesky.publicnode.com" --broadcast --verify -vv


When updating the smart contract:
- replace address of the aminal contract (everywhere) + address of the Visuals in subgraph.yaml
- copy  the ABI in both frontend and graph folder:   out/ContractName.sol/ContractName.json --> frontend/deployments/ + graph/abis/

reload the graph:
graph auth --studio 06bd7ece44455bca6730ca207e1f7606
cd graph
npm i (if needed)
graph codegen && graph build
graph deploy --studio aminals

When updating the graphQL:
- .graphclientrc.yml --> change the endpoint
npm run graphclient:build
*/

contract DeployAminals is Script {
    AminalFactory public factory;
    IAminalStructs.Visuals[] public initialVisuals;

    function deployAminalFactory() public returns (address) {
        // Deploy contracts in correct order
        Genes _Genes = new Genes();
        // TODO: Deploy GeneRegistry when needed for full Gene NFT system
        // For now, we use a placeholder address for the factory
        GeneAuction _geneAuction = new GeneAuction(
            address(_Genes),
            address(0x0) // Placeholder for GeneRegistry
        );
        AminalProposals _proposals = new AminalProposals();

        AminalFactory _factory = new AminalFactory();

        // Set environment variables for contracts
        vm.setEnv("AMINAL_FACTORY_CONTRACT", vm.toString(address(_factory)));
        vm.setEnv("AMINAL_PROPOSALS_CONTRACT", vm.toString(address(_proposals)));
        vm.setEnv("GENE_AUCTION_CONTRACT", vm.toString(address(_geneAuction)));
        vm.setEnv("GENES_NFT_CONTRACT", vm.toString(address(_Genes)));

        // Initialize the factory
        _factory.initialize(address(_geneAuction), address(_proposals), address(_Genes));

        // Setup dependencies
        _geneAuction.setup(address(_factory), address(_factory));
        _proposals.setup(address(_factory));
        _Genes.setup(address(_factory));

        return address(_factory);
    }

    function spawnInitialAminals(AminalFactory factoryInstance) public {
        // First Aminal with cute orangey theme (genes 0-7)
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId
        initialVisuals.push(IAminalStructs.Visuals(0, 1, 2, 3, 4, 5, 6, 7));

        // Second Aminal with 3 eyed monster theme (genes 8-15)
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId
        initialVisuals.push(IAminalStructs.Visuals(8, 9, 10, 11, 12, 13, 14, 15));

        // Third Aminal with blue/moon theme (genes 16-23)
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId
        initialVisuals.push(IAminalStructs.Visuals(16, 17, 18, 19, 20, 21, 22, 23));

        // Fourth Aminal with blue/moon theme (genes 25-31)
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId
        initialVisuals.push(IAminalStructs.Visuals(24, 25, 26, 27, 28, 29, 30, 31));

        factoryInstance.spawnInitialAminals(initialVisuals);
    }

    function deploySkills(AminalFactory factoryInstance) public {
        // Deploy skills - no registration needed in new architecture
        Move2D move2DSkill = new Move2D(address(factoryInstance));
        FightSkill fightSkiller = new FightSkill(address(factoryInstance));

        console.log("Move2D skill deployed to:", address(move2DSkill));
        console.log("FightSkill deployed to:", address(fightSkiller));
        console.log("Skills are globally accessible - no registration required");
    }

    function deployInitialGenes() public {
        Genes genes = Genes(vm.envAddress("GENES_NFT_CONTRACT"));

        // Deploy temporary minter contracts
        InitialGenesMinter minter = new InitialGenesMinter();
        console.log("InitialGenesMinter deployed to:", address(minter));
        InitialGenesMinter2 minter2 = new InitialGenesMinter2();
        console.log("InitialGenesMinter2 deployed to:", address(minter2));

        // Set minter as temporary gene factory
        genes.setFactory(address(minter));
        console.log("Set minter as temporary gene factory");

        // Mint initial genes
        minter.mintInitialGenesAnimated(genes, msg.sender);
        console.log("Initial genes minted to:", msg.sender);

        // Set minter as temporary gene factory
        genes.setFactory(address(minter2));
        console.log("Set minter2 as temporary gene factory");

        minter2.mintInitialGenesAnimated(genes, msg.sender);
        console.log("Initial genes minted to:", msg.sender);

        // Reset gene factory to address(0) for security
        genes.setFactory(address(0));
        console.log("Gene factory reset to address(0)");
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        factory = AminalFactory(deployAminalFactory());

        // Setup the factory to deploy loveVRGDA
        factory.setup();

        // Deploy and register skills
        deploySkills(factory);

        deployInitialGenes();

        spawnInitialAminals(factory);

        vm.stopBroadcast();
    }
}

// TODO what if invalid visuals get included - how to validate and ignore
