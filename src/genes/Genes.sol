// SPDX-License-Identifier: GPL-3.0-only

/// @title Aminal Gene NFTs
/// @notice ERC721 contract for managing individual gene traits used in Aminal composition
/// @dev Each Gene NFT contains SVG data and category information for visual trait rendering
/// @dev Genes are minted through the GeneRegistry and can be burned by their owners
/// @author Aminals Team
/// @custom:version 2.0

pragma solidity ^0.8.20;

import {ERC721} from "oz/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "oz/token/ERC721/extensions/ERC721Enumerable.sol";
import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";
import {Strings} from "oz/utils/Strings.sol";

import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {Base64} from "src/utils/Base64.sol";

/// @notice Gene NFT contract implementing ERC721 with enumerable extension
/// @dev Genes represent individual visual traits that can be composed into Aminals
/// @dev Each gene contains SVG data and belongs to a specific visual category
/// @dev Only the GeneRegistry can mint new genes, but owners can burn their genes
contract Genes is ERC721Enumerable, Initializable, Ownable {
    // ============ STATE VARIABLES ============

    /// @notice Address of the Aminal Factory contract
    /// @dev Used for access control on certain functions
    address public aminalFactory;

    /// @notice Address of the Gene Registry contract
    /// @dev Only the registry can mint new Gene NFTs
    address public geneRegistry;

    /// @notice Current token ID counter for minting
    /// @dev Incremented with each new gene minted
    uint256 public currentId;

    /// @notice Mapping from gene ID to its SVG content
    /// @dev Contains the actual visual representation of the gene
    mapping(uint256 id => string) public geneSVGs;

    /// @notice Mapping from gene ID to its visual category
    /// @dev Determines which trait slot this gene can fill in an Aminal
    mapping(uint256 id => IAminalStructs.VisualsCat) public geneVisualsCat;

    // ============ MODIFIERS ============

    /// @notice Restricts function access to the Aminal Factory only
    modifier onlyAminalsFactory() {
        if (msg.sender != aminalFactory) revert OnlyAminalsFactory();
        _;
    }

    /// @notice Restricts function access to the Gene Registry only
    modifier onlyRegistry() {
        if (msg.sender != geneRegistry) revert OnlyRegistry();
        _;
    }

    // ============ ERRORS ============

    /// @notice Thrown when a function can only be called by the Aminal Factory
    error OnlyAminalsFactory();

    /// @notice Thrown when a function can only be called by the Aminal Factory or Gene Registry
    error OnlyAminalsFactoryOrRegistry();

    /// @notice Thrown when a function can only be called by the NFT owner
    error OnlyNFTOwner();

    /// @notice Thrown when a function can only be called by the Gene Registry
    error OnlyRegistry();

    /// @notice Thrown when attempting to setup an already initialized contract
    error AlreadySetup();

    // ============ EVENTS ============

    /// @notice Emitted when the contract is initialized with an Aminal Factory
    /// @param aminalFactory Address of the Aminal Factory contract
    event Setup(address aminalFactory);

    /// @notice Emitted when the Gene Registry address is updated
    /// @param geneRegistry Address of the new Gene Registry contract
    event RegistrySet(address geneRegistry);

    // ============ CONSTRUCTOR ============

    /// @notice Initialize the Genes contract
    /// @dev Sets up ERC721 with name "Aminal Genes" and symbol "GENES"
    constructor() ERC721("Aminal Genes", "GENES") Initializable() Ownable() {}

    // ============ EXTERNAL FUNCTIONS ============

    /// @notice Initialize the contract with the Aminal Factory address
    /// @dev Can only be called once due to initializer modifier
    /// @param aminalFactory_ Address of the Aminal Factory contract
    function setup(address aminalFactory_) external initializer onlyOwner {
        aminalFactory = aminalFactory_;
        emit Setup(aminalFactory_);
    }

    /// @notice Set the Gene Registry contract address
    /// @dev TODO: Consider using a more secure access pattern instead of onlyOwner
    /// @param geneRegistry_ Address of the Gene Registry contract
    function setRegistry(address geneRegistry_) external onlyOwner {
        geneRegistry = geneRegistry_;
        emit RegistrySet(geneRegistry_);
    }

    /// @notice Mint a new Gene NFT
    /// @dev Can only be called by the Gene Registry contract
    /// @param to Address to mint the gene to
    /// @param geneSVG SVG content for the visual representation
    /// @param visualsCategory Category that this gene belongs to
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

    /// @notice Burn a Gene NFT
    /// @dev Can only be called by the current owner of the gene
    /// @param id Token ID of the gene to burn
    function burn(uint256 id) external {
        if (msg.sender != ownerOf(id)) revert OnlyNFTOwner();
        _burn(id);
    }

    /// @notice Get Gene NFT information
    /// @dev Returns both SVG content and visual category for a gene
    /// @param id Token ID of the gene to query
    /// @return svg SVG content string
    /// @return category Visual category enum value
    function getGeneInfo(uint256 id) external view returns (string memory svg, IAminalStructs.VisualsCat category) {
        return (geneSVGs[id], geneVisualsCat[id]);
    }

    // ============ PUBLIC FUNCTIONS ============

    /// @notice Generate token URI for a Gene NFT
    /// @dev Creates a base64 encoded JSON metadata following ERC721 standards
    /// @param tokenId Token ID to generate URI for
    /// @return Complete data URI string
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        string memory svg = geneSVGs[tokenId];
        IAminalStructs.VisualsCat category = geneVisualsCat[tokenId];

        // Create JSON metadata with the SVG embedded as base64 image
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

    // ============ INTERNAL FUNCTIONS ============

    /// @notice Convert VisualsCat enum to human-readable string
    /// @dev Used in token metadata generation
    /// @param category The visual category enum value
    /// @return Human-readable category name
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
