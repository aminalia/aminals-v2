// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {ERC721S} from "src/nft/ERC721S.sol";

error OnlyAminalsNFT();
error OnlyNFTOwner();

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

    // TODO: Make this NFT non-transferable upon calling e.g. addFace(), make it
    // transferable after it's accepted in the VisualAuction
    function makeTransferable(uint256 id) external onlyAminalsNFT {}

    // Can only be burnt by the holder
    function burn(uint256 id) external {
        if (msg.sender != ownerOf(id)) revert OnlyNFTOwner();
        _burn(id);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        return string(abi.encodePacked("GENE_SVG_PLACEHOLDER"));
    }
}
