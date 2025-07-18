#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// Read subgraph.yaml
const subgraphPath = path.join(__dirname, "../subgraph.yaml");
const subgraphContent = fs.readFileSync(subgraphPath, "utf8");
const subgraph = yaml.load(subgraphContent);

// Extract addresses from dataSources
const addresses = {};
subgraph.dataSources.forEach((dataSource) => {
  const contractName = dataSource.name;
  const address = dataSource.source.address;
  if (address && contractName) {
    addresses[contractName] = address;
  }
});

// Map contract names to expected constant names (for backwards compatibility)
const constantNameMap = {
  Genes: "GENES_NFT_ADDRESS",
  AminalFactory: "AMINAL_FACTORY_ADDRESS",
  GeneAuction: "GENE_AUCTION_ADDRESS",
  GeneRegistry: "GENE_REGISTRY_ADDRESS",
};

// Generate constants file content
const constantsContent = `// Auto-generated from subgraph.yaml
// DO NOT EDIT MANUALLY - run 'npm run generate-constants' to regenerate

${Object.entries(addresses)
  .map(([contractName, address]) => {
    const constantName =
      constantNameMap[contractName] ||
      contractName
        .replace(/([A-Z])/g, "_$1")
        .toUpperCase()
        .replace(/^_/, "") + "_ADDRESS";
    return `export const ${constantName} = "${address}";`;
  })
  .join("\n")}

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

// Deployed skill contract addresses (for reference)
export const MOVE_2D_SKILL_ADDRESS =
  "0x96f1597fc84c69aef97a8af274b7709a0f38d84a";
export const MOVE_TWICE_SKILL_ADDRESS =
  "0x7580880b51894f0f8c04143b551723793ea2a8c8";
`;

// Write constants.ts
const constantsPath = path.join(__dirname, "../src/constants.ts");
fs.writeFileSync(constantsPath, constantsContent);

console.log("Generated constants.ts from subgraph.yaml addresses");
