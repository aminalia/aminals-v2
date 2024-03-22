// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {ERC721S} from "src/nft/ERC721S.sol";

error OnlyAminalsNFT();

contract ProposerNFT is ERC721S("ProposerNFT", "PROP") {
    address public immutable aminalsNFT;
    uint256 public currentId;

    modifier onlyAminalsNFT() {
        if (msg.sender != aminalsNFT) revert OnlyAminalsNFT();
        _;
    }

    constructor(address aminalsNFT_) {
        aminalsNFT = aminalsNFT_;
    }

    function mint(address to) external onlyAminalsNFT {
        ++currentId;
        _mint(to, currentId);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        return string(abi.encodePacked("GENE_SVG_PLACEHOLDER"));
    }
}
