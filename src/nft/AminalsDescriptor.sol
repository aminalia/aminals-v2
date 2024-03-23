/// @title A library used to construct ERC721 token URIs and SVG images
/// @dev From the Nouns NFT descriptor

pragma solidity ^0.8.20;

import {Base64} from "src/utils/Base64.sol";
import {IAminal} from "src/IAminal.sol";
import {NFTDescriptor} from "src/nft/NFTDescriptor.sol";
import {GenesNFT} from "src/nft/GenesNFT.sol";

abstract contract AminalsDescriptor is IAminal, NFTDescriptor {
    uint8 private constant _ADDRESS_LENGTH = 20;
    bytes16 private constant _SYMBOLS = "0123456789abcdef";

    /// @notice Body parts (SVG strings)
    VisualTrait[] public backgrounds;
    VisualTrait[] public arms;
    VisualTrait[] public tails;
    VisualTrait[] public ears;
    VisualTrait[] public bodies;
    VisualTrait[] public faces;
    VisualTrait[] public mouths;
    VisualTrait[] public miscs;

    struct VisualTrait {
        string svg;
        address creator;
    }

    enum VisualsCat {
        BACK,
        ARM,
        TAIL,
        EARS,
        BODY,
        FACE,
        MOUTH,
        MISC
    }

    event TraitAdded(uint256 visualId, VisualsCat catEnum, string svg, address creator);

    // ------------------------------------------------------------------------
    // NFT Descriptors
    // ------------------------------------------------------------------------

    /**
     * @notice Given a token ID and seed, construct a base64 encoded data URI for an NFT.
     */
    function dataURI(uint256 tokenId) public view returns (string memory) {
        string memory name = string(abi.encodePacked("Aminal #", _toString(tokenId)));

        // Need to pull the image number for each token id, set to 0 for now, tokenId 1 for testing
        string memory image =
            string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(_aminalImage(tokenId)))));
        string memory description =
            string(abi.encodePacked("This NFT represents a digital pet. This NFT cannot be transfered."));
        string memory attributes = generateAttributesList(tokenId);

        return genericDataURI(name, description, image, attributes);
    }

    /**
     * @notice Given a token ID, construct a base64 encoded SVG.
     */
    function _aminalImage(uint256 _tokenId) internal view returns (string memory output) {
        Visuals memory visuals = getAminalVisualsByID(_tokenId);

        // Aminal Base - for all Aminals
        output = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 1000 1000">';
        output = string(abi.encodePacked(output, backgrounds[visuals.backId].svg));
        output = string(
            abi.encodePacked(
                output, '<g id="shadow"><ellipse fill="#3c3d55" opacity="0.5"  cx="505" cy="971" rx="163" ry="12"/></g>'
            )
        );

        // TODO flag invalid SVG IDs and skip rendering them? Default to empty
        output = string(abi.encodePacked(output, tails[visuals.tailId].svg));
        output = string(abi.encodePacked(output, arms[visuals.armId].svg));
        output = string(abi.encodePacked(output, ears[visuals.earsId].svg));
        output = string(abi.encodePacked(output, bodies[visuals.bodyId].svg));
        output = string(abi.encodePacked(output, faces[visuals.faceId].svg));
        output = string(abi.encodePacked(output, mouths[visuals.mouthId].svg));
        output = string(abi.encodePacked(output, miscs[visuals.miscId].svg));

        // end of svg
        output = string(abi.encodePacked(output, "</svg>"));
    }

    function getAminalVisualsByID(uint256 aminalID) public view virtual returns (Visuals memory);


    // forgefmt: disable-start
    function getVisuals(uint256 category, uint256 id) public view returns (string memory) {
        if (VisualsCat(category) == VisualsCat.BACK) {
            if (backgrounds.length > id) { return backgrounds[id].svg; }
        } else if (VisualsCat(category) == VisualsCat.ARM) {
            if (arms.length > id) { return arms[id].svg; }
        } else if (VisualsCat(category) == VisualsCat.TAIL) {
             if (tails.length > id) { return tails[id].svg; }
        } else if (VisualsCat(category) == VisualsCat.EARS) {
            if (ears.length > id) { return ears[id].svg; }
        } else if (VisualsCat(category) == VisualsCat.BODY) {
            if (bodies.length > id) { return bodies[id].svg; }
        } else if (VisualsCat(category) == VisualsCat.FACE) {
            if (faces.length > id) { return faces[id].svg; }
        } else if (VisualsCat(category) == VisualsCat.MOUTH) {
            if (mouths.length > id) { return mouths[id].svg; }
        } else if (VisualsCat(category) == VisualsCat.MISC) {
            if (backgrounds.length > id) { return miscs[id].svg; }
        }

        return "";
    }
    // forgefmt: disable-end

    // ------------------------------------------------------------------------
    // NFT Attributes
    // ------------------------------------------------------------------------

    /**
     * @notice NFT Atrributes based on Token ID
     */
    function generateAttributesList(uint256 tokenId) public pure returns (string memory) {
        return string(abi.encodePacked('{"trait_type":"Aminal ID","value":', _toString(tokenId), "}"));
    }

    /**
     * @notice Given a name, description, and seed, construct a base64 encoded data URI.
     */
    function genericDataURI(
        string memory _name,
        string memory _description,
        string memory _image,
        string memory _attributes
    ) public pure returns (string memory) {
        TokenURIParams memory params =
            TokenURIParams({name: _name, description: _description, image: _image, attributes: _attributes});
        return constructTokenURI(params);
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

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
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function _toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
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

    /**
     * @dev Converts an `address` with fixed length of 20 bytes to its not checksummed ASCII `string` hexadecimal representation.
     */
    function _toHexString(address addr) internal pure returns (string memory) {
        return _toHexString(uint256(uint160(addr)), _ADDRESS_LENGTH);
    }
}
