// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {Genes} from "src/genes/Genes.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {Ownable} from "oz/access/Ownable.sol";

// TODO rename to registry? Merge with Genes?
/**
 * @title GeneRegistry
 * @dev Factory for creating Gene NFTs representing traits for Aminals, also serves as a registry for Gene NFTs
 * @notice Anyone can create Gene NFTs from this factory for permissionless trait creation
 */
contract GeneRegistry is IAminalStructs, Ownable {
    /// @notice The main Gene NFT contract
    Genes public immutable geneNFT;

    /// @notice Registry mapping to verify Gene NFTs came from this factory
    mapping(uint256 geneId => bool isFromFactory) public geneRegistry;

    /// @notice Mapping from gene ID to creator address
    mapping(uint256 geneId => address creator) public geneCreators;

    /// @notice Mapping from gene ID to trait category
    mapping(uint256 geneId => VisualsCat category) public geneCategories;

    /// @notice Mapping from gene ID to SVG content
    mapping(uint256 geneId => string svg) public geneSVGs;

    /// @notice Counter for tracking total genes created
    uint256 public totalGenesCreated;

    /// @notice Minimum ETH required to create a Gene NFT (prevents spam)
    uint256 public constant MIN_CREATION_FEE = 0.001 ether;

    /// @notice Maximum SVG length to prevent bloated storage
    uint256 public constant MAX_SVG_LENGTH = 50_000; // 50KB limit

    error InsufficientFee();
    error SVGTooLarge();
    error EmptySVG();
    error InvalidSVG();

    event GeneCreated(uint256 indexed geneId, address indexed creator, VisualsCat indexed category, string svg);

    constructor(address _geneNFT) {
        geneNFT = Genes(_geneNFT);
    }

    /**
     * @notice Create a new Gene NFT with trait data
     * @dev Anyone can call this function to create permissionless traits
     * @param svg The SVG content for the trait
     * @param category The visual category for the trait
     * @return geneId The ID of the created Gene NFT
     */
    function createGene(string calldata svg, VisualsCat category) external payable returns (uint256 geneId) {
        if (msg.value < MIN_CREATION_FEE) revert InsufficientFee();
        if (bytes(svg).length == 0) revert EmptySVG();
        if (bytes(svg).length > MAX_SVG_LENGTH) revert SVGTooLarge();

        // Basic SVG validation - check for opening and closing tags
        if (!_isValidSVG(svg)) revert InvalidSVG();

        // Get the gene ID that will be minted (current counter value)
        geneId = geneNFT.currentId();

        // Mint the Gene NFT to the creator
        geneNFT.mint(msg.sender, svg, category);

        // Register the gene as coming from this factory
        geneRegistry[geneId] = true;
        geneCreators[geneId] = msg.sender;
        geneCategories[geneId] = category;
        geneSVGs[geneId] = svg;

        totalGenesCreated++;

        emit GeneCreated(geneId, msg.sender, category, svg);

        return geneId;
    }

    /**
     * @notice Check if a Gene NFT was created from this factory
     * @param geneId The ID of the Gene NFT to check
     * @return bool True if the gene was created from this factory
     */
    function isValidGene(uint256 geneId) external view returns (bool) {
        return geneRegistry[geneId];
    }

    /**
     * @notice Get Gene NFT information
     * @param geneId The ID of the Gene NFT
     * @return creator The creator address
     * @return category The visual category
     * @return svg The SVG content
     */
    function getGeneInfo(uint256 geneId)
        external
        view
        returns (address creator, VisualsCat category, string memory svg)
    {
        return (geneCreators[geneId], geneCategories[geneId], geneSVGs[geneId]);
    }

    /**
     * @notice Get all Gene NFTs by creator
     * @param creator The creator address
     * @return geneIds Array of Gene NFT IDs created by the address
     */
    function getGenesByCreator(address creator) external view returns (uint256[] memory geneIds) {
        // Count genes by creator
        uint256 count = 0;
        for (uint256 i = 0; i < totalGenesCreated; i++) {
            if (geneCreators[i] == creator) count++;
        }

        // Build array of gene IDs
        geneIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < totalGenesCreated; i++) {
            if (geneCreators[i] == creator) {
                geneIds[index] = i;
                index++;
            }
        }
    }

    /**
     * @notice Get all Gene NFTs by category
     * @param category The visual category
     * @return geneIds Array of Gene NFT IDs in the category
     */
    function getGenesByCategory(VisualsCat category) external view returns (uint256[] memory geneIds) {
        // Count genes by category
        uint256 count = 0;
        for (uint256 i = 0; i < totalGenesCreated; i++) {
            if (geneCategories[i] == category) count++;
        }

        // Build array of gene IDs
        geneIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < totalGenesCreated; i++) {
            if (geneCategories[i] == category) {
                geneIds[index] = i;
                index++;
            }
        }
    }

    /**
     * @notice Withdraw collected fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success,) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @notice Basic SVG validation
     * @dev Checks for basic SVG structure - not comprehensive security validation
     * @param svg The SVG string to validate
     * @return bool True if SVG appears valid
     */
    function _isValidSVG(string calldata svg) internal pure returns (bool) {
        bytes memory svgBytes = bytes(svg);

        // Check for basic SVG structure
        // Must contain opening tag (could be <svg, <g, <path, etc.)
        bool hasOpeningTag = false;
        for (uint256 i = 0; i < svgBytes.length - 1; i++) {
            if (svgBytes[i] == "<" && svgBytes[i + 1] != "/") {
                hasOpeningTag = true;
                break;
            }
        }

        return hasOpeningTag;
    }
}
