/// @title Gene NFT-based descriptor for Aminals
/// @dev Replaces trait arrays with Gene NFT-based trait system

pragma solidity ^0.8.20;

import {Base64} from "src/utils/Base64.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {Genes} from "src/genes/Genes.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";

abstract contract GeneRenderer is IAminalStructs {
    uint8 private constant _ADDRESS_LENGTH = 20;
    bytes16 private constant _SYMBOLS = "0123456789abcdef";

    /// @notice Token URI construction parameters
    struct TokenURIParams {
        string name;
        string description;
        string image;
        string attributes;
    }

    /// @notice Gene NFT contracts
    Genes public genes;
    GeneRegistry public geneFactory;

    constructor(address _Genes, address _geneFactory) {
        genes = Genes(_Genes);
        geneFactory = GeneRegistry(_geneFactory);
    }

    /**
     * @notice Construct an ERC721 token URI
     * @dev Merged from NFTDescriptor contract
     */
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

    /**
     * @notice Given a token ID and seed, construct a base64 encoded data URI for an NFT.
     */
    function dataURI(uint256 tokenId) public view returns (string memory) {
        string memory name = string(abi.encodePacked("Aminal #", _toString(tokenId)));

        string memory image =
            string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(_aminalImage(tokenId)))));
        string memory description =
            string(abi.encodePacked("This NFT represents a digital pet. This NFT cannot be transfered."));
        string memory attributes = generateAttributesList(tokenId);

        return constructTokenURI(
            TokenURIParams({name: name, description: description, image: image, attributes: attributes})
        );
    }

    /**
     * @notice Given an aminal ID, construct a base64 encoded SVG.
     */
    function _aminalImage(uint256 aminalId) internal view returns (string memory output) {
        // Get the visuals for this Aminal
        Visuals memory visuals = getAminalVisualsByID(aminalId);

        // Aminal Base - for all Aminals
        output = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 1000 1000">';

        // Add background
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.backId)));

        // Add shadow
        output = string(
            abi.encodePacked(
                output, '<g id="shadow"><ellipse fill="#3c3d55" opacity="0.5"  cx="505" cy="971" rx="163" ry="12"/></g>'
            )
        );

        // Add traits in rendering order
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.tailId)));
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.armId)));
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.earsId)));
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.bodyId)));
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.faceId)));
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.mouthId)));
        output = string(abi.encodePacked(output, _getGeneNFTSVG(visuals.miscId)));

        // end of svg
        output = string(abi.encodePacked(output, "</svg>"));
    }

    /**
     * @notice Get SVG content for a specific Gene NFT ID
     */
    function _getGeneNFTSVG(uint256 geneId) internal view returns (string memory) {
        if (geneId == 0) return ""; // No trait set

        // Try to get gene info, but handle case where Gene NFT doesn't exist
        try genes.getGeneInfo(geneId) returns (string memory svg, VisualsCat) {
            return svg;
        } catch {
            // Gene NFT doesn't exist, return empty string
            return "";
        }
    }

    function getAminalVisualsByID(uint256 aminalID) public view virtual returns (Visuals memory);

    /**
     * @notice Generate attributes list for NFT metadata
     */
    function generateAttributesList(uint256 aminalId) public view returns (string memory) {
        Visuals memory visuals = getAminalVisualsByID(aminalId);
        string memory attributes = "";
        bool firstAttribute = true;

        uint256[8] memory geneIds = [
            visuals.backId,
            visuals.armId,
            visuals.tailId,
            visuals.earsId,
            visuals.bodyId,
            visuals.faceId,
            visuals.mouthId,
            visuals.miscId
        ];

        for (uint256 i = 0; i < 8; i++) {
            uint256 geneId = geneIds[i];

            if (geneId != 0) {
                VisualsCat category = VisualsCat(i);
                string memory categoryName = _getCategoryName(category);

                if (!firstAttribute) attributes = string(abi.encodePacked(attributes, ","));
                else firstAttribute = false;

                // Try to get creator address, but handle case where Gene NFT doesn't exist
                address creator = address(0);
                try genes.ownerOf(geneId) returns (address owner) {
                    creator = owner;
                } catch {
                    // Gene NFT doesn't exist, use zero address
                }

                attributes = string(
                    abi.encodePacked(
                        attributes,
                        '{"trait_type":"',
                        categoryName,
                        '","value":"Gene #',
                        _toString(geneId),
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

    /**
     * @notice Converts a uint256 to its ASCII string decimal representation.
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    /**
     * @notice Converts a `uint160` to its ASCII `string` hexadecimal representation with fixed length.
     */
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
}
