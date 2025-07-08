/// @title Gene NFT-based descriptor for Aminals
/// @notice Renders visual representations of Aminals using Gene NFT system
/// @dev Abstract contract that provides SVG generation and metadata construction for Aminals
/// @dev Replaces traditional trait arrays with a composable Gene NFT-based trait system
/// @author Aminals Team
/// @custom:version 2.0

pragma solidity ^0.8.20;

import {Base64} from "src/utils/Base64.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {Genes} from "src/genes/Genes.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";
import {Strings} from "oz/utils/Strings.sol";

/// @notice Abstract contract implementing Gene NFT-based rendering for Aminals
/// @dev This contract handles the visual composition of Aminals by combining multiple Gene NFTs
///      Each Gene NFT represents a specific visual trait (background, body, face, etc.)
///      The rendering order is important for proper layering of visual elements
abstract contract GeneRenderer is IAminalStructs {
    // ============ CONSTANTS ============

    /// @dev Length of Ethereum address in bytes
    uint8 private constant _ADDRESS_LENGTH = 20;

    /// @dev Hexadecimal characters for address conversion
    bytes16 private constant _SYMBOLS = "0123456789abcdef";

    /// @dev Number of visual trait categories
    uint8 private constant _TRAIT_CATEGORIES = 8;

    // ============ STRUCTS ============

    /// @notice Parameters for constructing ERC721 token URI
    /// @param name The name of the NFT
    /// @param description Brief description of the NFT
    /// @param image Base64 encoded image data URI
    /// @param attributes JSON string of NFT attributes
    struct TokenURIParams {
        string name;
        string description;
        string image;
        string attributes;
    }

    // ============ STATE VARIABLES ============

    /// @notice Contract for managing Gene NFTs that contain SVG data and trait information
    Genes public immutable genes;

    /// @notice Registry contract for managing Gene NFT creation and categorization
    GeneRegistry public immutable geneFactory;

    // ============ CONSTRUCTOR ============

    /// @notice Initialize the Gene Renderer with required contracts
    /// @param _Genes Address of the Genes contract containing SVG data
    /// @param _geneFactory Address of the GeneRegistry contract
    constructor(address _Genes, address _geneFactory) {
        genes = Genes(_Genes);
        geneFactory = GeneRegistry(_geneFactory);
    }

    // ============ EXTERNAL FUNCTIONS ============

    /// @notice Generate a complete data URI for an Aminal NFT
    /// @dev Combines name, description, image, and attributes into a base64 encoded JSON
    /// @param tokenId The Aminal token ID to generate URI for
    /// @return Complete data URI string ready for use as tokenURI
    function dataURI(uint256 tokenId) public view returns (string memory) {
        string memory name = string(abi.encodePacked("Aminal #", Strings.toString(tokenId)));

        string memory image =
            string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(_aminalImage(tokenId)))));

        string memory description =
            string(abi.encodePacked("This NFT represents a digital pet. This NFT cannot be transfered."));

        string memory attributes = generateAttributesList(tokenId);

        return constructTokenURI(
            TokenURIParams({name: name, description: description, image: image, attributes: attributes})
        );
    }

    /// @notice Generate JSON attributes list for NFT metadata
    /// @dev Creates attribute objects for each non-zero gene ID with trait type and creator info
    /// @param aminalId The Aminal ID to generate attributes for
    /// @return JSON string containing array of attribute objects
    function generateAttributesList(uint256 aminalId) public view returns (string memory) {
        Visuals memory visuals = getAminalVisualsByID(aminalId);
        string memory attributes = "";
        bool firstAttribute = true;

        // Array of gene IDs in trait category order
        uint256[_TRAIT_CATEGORIES] memory geneIds = [
            visuals.backId,
            visuals.armId,
            visuals.tailId,
            visuals.earsId,
            visuals.bodyId,
            visuals.faceId,
            visuals.mouthId,
            visuals.miscId
        ];

        for (uint256 i = 0; i < _TRAIT_CATEGORIES; i++) {
            uint256 geneId = geneIds[i];

            if (geneId != 0) {
                VisualsCat category = VisualsCat(i);
                string memory categoryName = _getCategoryName(category);

                if (!firstAttribute) attributes = string(abi.encodePacked(attributes, ","));
                else firstAttribute = false;

                // Get creator address safely
                address creator = _getGeneCreator(geneId);

                attributes = string(
                    abi.encodePacked(
                        attributes,
                        '{"trait_type":"',
                        categoryName,
                        '","value":"Gene #',
                        Strings.toString(geneId),
                        '"}',
                        ',{"trait_type":"',
                        categoryName,
                        ' Creator","value":"',
                        _toHexString(uint160(creator), 20),
                        '"}'
                    )
                );
            }
        }

        return attributes;
    }

    // ============ PUBLIC FUNCTIONS ============

    /// @notice Construct an ERC721 token URI from parameters
    /// @dev Creates a base64 encoded JSON data URI compliant with ERC721 metadata standard
    /// @param params Struct containing all required URI components
    /// @return Complete data URI string
    function constructTokenURI(TokenURIParams memory params) public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"',
                            params.name,
                            '", "description":"',
                            params.description,
                            '", "image": "',
                            params.image,
                            '", "attributes": [',
                            params.attributes,
                            "]}"
                        )
                    )
                )
            )
        );
    }

    // ============ INTERNAL FUNCTIONS ============

    /// @notice Generate complete SVG image for an Aminal
    /// @dev Combines background, shadow, and all trait layers in proper rendering order
    /// @param aminalId The Aminal ID to generate image for
    /// @return output Complete SVG string ready for base64 encoding
    function _aminalImage(uint256 aminalId) internal view returns (string memory output) {
        // Get the visual trait configuration for this Aminal
        Visuals memory visuals = getAminalVisualsByID(aminalId);

        // Start SVG container with proper viewBox
        output = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 1000 1000">';

        // Layer 1: Background
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.backId)));

        // Layer 2: Shadow (always rendered, provides depth)
        output = string(
            abi.encodePacked(
                output, '<g id="shadow"><ellipse fill="#3c3d55" opacity="0.5" cx="505" cy="971" rx="163" ry="12"/></g>'
            )
        );

        // Layers 3-9: Trait layers in proper rendering order (back to front)
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.tailId))); // Behind body
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.armId))); // Behind body
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.earsId))); // Behind body
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.bodyId))); // Main body
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.faceId))); // Face features
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.mouthId))); // Mouth on face
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.miscId))); // Front accessories

        // Close SVG container
        output = string(abi.encodePacked(output, "</svg>"));
    }

    /// @notice Safely retrieve SVG content for a Gene NFT
    /// @dev Handles the case where a Gene NFT might not exist or be burned
    /// @param geneId The Gene NFT ID to get SVG for
    /// @return SVG string content, empty string if gene doesn't exist
    function _getGeneNFTSVG(uint256 geneId) internal view returns (string memory) {
        if (geneId == 0) return ""; // No trait set for this category

        // Safely attempt to get gene info
        try genes.getGeneInfo(geneId) returns (string memory svg, VisualsCat) {
            return svg;
        } catch {
            // Gene NFT doesn't exist or was burned, return empty string
            return "";
        }
    }

    /// @notice Safely get the creator/owner of a Gene NFT
    /// @dev Handles the case where a Gene NFT might not exist or be burned
    /// @param geneId The Gene NFT ID to get creator for
    /// @return creator Address of the gene creator, zero address if gene doesn't exist
    function _getGeneCreator(uint256 geneId) internal view returns (address creator) {
        try genes.ownerOf(geneId) returns (address owner) {
            return owner;
        } catch {
            // Gene NFT doesn't exist or was burned
            return address(0);
        }
    }

    /// @notice Convert VisualsCat enum to human-readable string
    /// @dev Used for generating NFT metadata attributes
    /// @param category The trait category enum value
    /// @return Human-readable category name
    function _getCategoryName(VisualsCat category) internal pure returns (string memory) {
        if (category == VisualsCat.BACK) return "Background";
        if (category == VisualsCat.ARM) return "Arms";
        if (category == VisualsCat.TAIL) return "Tail";
        if (category == VisualsCat.EARS) return "Ears";
        if (category == VisualsCat.BODY) return "Body";
        if (category == VisualsCat.FACE) return "Face";
        if (category == VisualsCat.MOUTH) return "Mouth";
        if (category == VisualsCat.MISC) return "Miscellaneous";
        return "Unknown";
    }

    /// @notice Convert a uint160 to its ASCII hexadecimal representation
    /// @dev Used for formatting Ethereum addresses in metadata
    /// @param value The numeric value to convert
    /// @param length The desired length of the hex string
    /// @return Hexadecimal string representation with "0x" prefix
    function _toHexString(uint160 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }

    // ============ ABSTRACT FUNCTIONS ============

    /// @notice Get visual trait configuration for an Aminal
    /// @dev Must be implemented by inheriting contracts to provide Aminal-specific logic
    /// @param aminalID The Aminal token ID
    /// @return visuals Struct containing all gene IDs for visual traits
    function getAminalVisualsByID(uint256 aminalID) public view virtual returns (Visuals memory visuals);
}
