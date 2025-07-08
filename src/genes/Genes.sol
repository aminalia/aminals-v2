// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {ERC721} from "oz/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "oz/token/ERC721/extensions/ERC721Enumerable.sol";
import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";
import {Strings} from "oz/utils/Strings.sol";

import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {Base64} from "src/utils/Base64.sol";

error OnlyAminalsFactory();
error OnlyAminalsFactoryOrRegistry();
error OnlyNFTOwner();
error OnlyRegistry();
error AlreadySetup();

contract Genes is ERC721Enumerable, Initializable, Ownable {
    address public aminalFactory;
    address public geneRegistry;
    uint256 public currentId;
    mapping(uint256 id => string) public geneSVGs;
    mapping(uint256 id => IAminalStructs.VisualsCat) public geneVisualsCat;

    modifier onlyAminalsFactory() {
        if (msg.sender != aminalFactory) revert OnlyAminalsFactory();
        _;
    }

    modifier onlyRegistry() {
        if (msg.sender != geneRegistry) revert OnlyRegistry();
        _;
    }

    event Setup(address aminalFactory);
    event RegistrySet(address geneRegistry);

    constructor() ERC721("Aminal Genes", "GENES") Initializable() Ownable() {}

    function setup(address aminalFactory_) external initializer onlyOwner {
        aminalFactory = aminalFactory_;

        emit Setup(aminalFactory_);
    }

    // TODO not good, too much power to the owner
    function setRegistry(address geneRegistry_) external onlyOwner {
        geneRegistry = geneRegistry_;
        emit RegistrySet(geneRegistry_);
    }

    function mint(address to, string calldata geneSVG, IAminalStructs.VisualsCat visualsCategory)
        external
        onlyRegistry
    {
        uint256 tokenId = currentId;
        geneSVGs[tokenId] = geneSVG;
        geneVisualsCat[tokenId] = visualsCategory;

        ++currentId;
        _mint(to, tokenId);
    }

    // Can only be burnt by the holder
    function burn(uint256 id) external {
        if (msg.sender != ownerOf(id)) revert OnlyNFTOwner();
        _burn(id);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        string memory svg = geneSVGs[tokenId];
        IAminalStructs.VisualsCat category = geneVisualsCat[tokenId];

        // Create JSON metadata with the SVG
        string memory json = string(
            abi.encodePacked(
                '{"name": "Aminal Gene #',
                Strings.toString(tokenId),
                '", "description": "A gene NFT representing a trait for Aminals", "category": "',
                _categoryToString(category),
                '", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(svg)),
                '"}'
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    /**
     * @notice Get Gene NFT information
     */
    function getGeneInfo(uint256 id) external view returns (string memory svg, IAminalStructs.VisualsCat category) {
        return (geneSVGs[id], geneVisualsCat[id]);
    }

    /**
     * @dev Convert VisualsCat enum to string
     */
    function _categoryToString(IAminalStructs.VisualsCat category) internal pure returns (string memory) {
        if (category == IAminalStructs.VisualsCat.BACK) return "Background";
        if (category == IAminalStructs.VisualsCat.ARM) return "Arms";
        if (category == IAminalStructs.VisualsCat.TAIL) return "Tail";
        if (category == IAminalStructs.VisualsCat.EARS) return "Ears";
        if (category == IAminalStructs.VisualsCat.BODY) return "Body";
        if (category == IAminalStructs.VisualsCat.FACE) return "Face";
        if (category == IAminalStructs.VisualsCat.MOUTH) return "Mouth";
        if (category == IAminalStructs.VisualsCat.MISC) return "Miscellaneous";
        return "Unknown";
    }
}
