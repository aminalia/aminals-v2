// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {ERC721S} from "src/nft/ERC721S.sol";
import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";

error OnlyAminalsNFT();
error OnlyNFTOwner();
error AlreadySetup();

contract GenesNFT is ERC721S("GenesNFT", "GENES"), Initializable, Ownable {
    address public aminalsNFT;
    uint256 public currentId;

    modifier onlyAminalsNFT() {
        if (msg.sender != aminalsNFT) revert OnlyAminalsNFT();
        _;
    }

    constructor(address aminalsNFT_) Initializable() Ownable() {
        aminalsNFT = aminalsNFT_;
    }

    function setup(address aminalsNFT_) external initializer onlyOwner {
        aminalsNFT = aminalsNFT_;
    }

    // TODO: Pass in SVG code upon minting
    function mint(address to) external onlyAminalsNFT {
        ++currentId;
        _mint(to, currentId);
    }

    // TODO: Make this NFT non-transferable upon calling e.g. addFace(), make it
    // transferable after it's accepted in the VisualRegistry (VisualRegistry
    // acceptance is not implemented yet, it's auto-accepted. Eventually it will
    // be accepted by Aminals voting)
    // NOTE: Right now, all of the NFTs are transferable. Soulbound NFTs are not
    // yet implemented.
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
