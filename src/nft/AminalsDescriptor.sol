/// @title A library used to construct ERC721 token URIs and SVG images
/// @dev From the Nouns NFT descriptor

pragma solidity ^0.8.20;

import {Base64} from "src/utils/Base64.sol";
import {IAminal} from "src/IAminal.sol";
import {NFTDescriptor} from "src/nft/NFTDescriptor.sol";

abstract contract AminalsDescriptor is IAminal, NFTDescriptor {
    uint8 private constant _ADDRESS_LENGTH = 20;
    bytes16 private constant _SYMBOLS = "0123456789abcdef";

    /// @notice Body parts (SVG strings)
    string[] public backgrounds;
    string[] public arms;
    string[] public tails;
    string[] public ears;
    string[] public bodies;
    string[] public faces;
    string[] public mouths;
    string[] public miscs;

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
        output = string(abi.encodePacked(output, backgrounds[visuals.backId]));
        output = string(
            abi.encodePacked(
                output, '<g id="shadow"><ellipse fill="#3c3d55" opacity="0.5"  cx="505" cy="971" rx="163" ry="12"/></g>'
            )
        );

        // TODO flag invalid SVG IDs and skip rendering them? Default to empty
        output = string(abi.encodePacked(output, tails[visuals.tailId]));
        output = string(abi.encodePacked(output, arms[visuals.armId]));
        output = string(abi.encodePacked(output, ears[visuals.earsId]));
        output = string(abi.encodePacked(output, bodies[visuals.bodyId]));
        output = string(abi.encodePacked(output, faces[visuals.faceId]));
        output = string(abi.encodePacked(output, mouths[visuals.mouthId]));
        output = string(abi.encodePacked(output, miscs[visuals.miscId]));

        // end of svg
        output = string(abi.encodePacked(output, "</svg>"));
    }

    function getAminalVisualsByID(uint256 aminalID) public view virtual returns (Visuals memory);

    // ------------------------------------------------------------------------
    // SVG Parts - Need to add owner permissions
    // ------------------------------------------------------------------------

    // eg. 00a79d
    function addBackground(string memory background) public returns (uint256 id) {
        backgrounds.push(background);
        return backgrounds.length - 1;
    }

    // Aminal #0 - Arms
    // <g id="Arms"><g><g><path class="cls-10" d="m293,378c-31,37-68,71-112,93,22,1,42-2,64-2-10,1-21,4-31,9,14-1,28-3,42-5-11,9-23,19-35,28,11-5,22-11,33-16-8,7-17,14-26,21,5-1,9-4,14-7-8,5-16,12-24,17-6,4-19,12-27,13,20-1,41-5,60-13-12,8-23,19-33,30,10-6,20-13,30-20-10,8-19,19-26,31,8-8,17-16,26-24-14,13-22,35-32,51,15-16,31-32,47-47-16,25-26,53-33,83,8-18,18-35,33-49-15,58-13,114,2,172-1-19,0-39,5-58,6,62,27,119,61,172-22-62-35-125-38-192,6,21,12,42,20,63-1-33-2-66-4-99,4,16,9,28,19,42-9-32-14-64-12-98,4,14,8,28,20,38-13-30-19-60-18-94,4,18,10,36,16,53,0-40,2-79,8-119,4,14,8,28,12,42,1-19,3-38,7-56"/></g><g><path class="cls-10" d="m707,378c31,37,68,71,112,93-22,1-42-2-64-2,10,1,21,4,31,9-14-1-28-3-42-5,11,9,23,19,35,28-11-5-22-11-33-16,8,7,17,14,26,21-5-1-9-4-14-7,8,5,16,12,24,17,6,4,19,12,27,13-20-1-41-5-60-13,12,8,23,19,33,30-10-6-20-13-30-20,10,8,19,19,26,31-8-8-17-16-26-24,14,13,22,35,32,51-15-16-31-32-47-47,16,25,26,53,33,83-8-18-18-35-33-49,15,58,13,114-2,172,1-19,0-39-5-58-6,62-27,119-61,172,22-62,35-125,38-192-6,21-12,42-20,63,1-33,2-66,4-99-4,16-9,28-19,42,9-32,14-64,12-98-4,14-8,28-20,38,13-30,19-60,18-94-4,18-10,36-16,53,0-40-2-79-8-119-4,14-8,28-12,42-1-19-3-38-7-56"/> </g></g> </g>
    function addArm(string memory arm) public returns (uint256 id) {
        arms.push(arm);
        return arms.length - 1;
    }

    // Aminal #0 - Tail
    // '<g id="tail"><path class="cls-18" d="m514,544c22,50,22,108,1,159-14,38-38,85-10,121,5,7,13,11,23,13,10,1,21-1,28-8,5-5,8-15,3-22-2-3-7-4-11-3-8,3-4,14,1,19,6,4,13,4,21,2,17-5,28-20,43-30,10-6,24-9,35-2-5-2-11-2-17-1-5,1-11,3-15,7-14,10-25,27-42,35-9,4-21,5-30-1-11-7-16-26-5-37,8-7,21-7,30-1,14,9,15,30,7,44-13,24-47,30-71,18-33-16-46-56-42-91,1-25,10-50,17-74,6-21,9-42,6-63-2-20-8-41-18-59,0,0,47-23,47-23h0Z"/> </g>'
    function addTail(string memory tail) public returns (uint256 id) {
        tails.push(tail);
        return tails.length - 1;
    }

    // Aminal #0 - Ears
    // '<g id="Ears"><g><g><path class="cls-10" d="m335,346c-19-63-24-132-12-198,33,43,71,83,114,117"/><path class="cls-11" d="m340,287c-5-16-8-33-7-50,1,2,3,5,4,8,0-13,0-26,0-39,12,16,28,31,46,41"/></g><g><path class="cls-10" d="m665,342c19-63,24-132,12-198-33,43-71,83-114,117"/><path class="cls-11" d="m660,283c5-16,8-33,7-50-1,2-3,5-4,8,0-13,0-26,0-39-12,16-28,31-46,41"/></g></g> </g>'
    function addEar(string memory ear) public returns (uint256 id) {
        ears.push(ear);
        return ears.length - 1;
    }

    // Aminal #0 - Body
    // '<g id="Body"><path class="cls-10" d="m710,398c0,116-94,281-210,281s-210-165-210-281,94-218,210-218,210,102,210,218Z"/> </g> <g id="Body_OL1"><circle class="cls-20" cx="500" cy="375" r="188"/> </g> <g id="Body_OL2"><g><path class="cls-16" d="m312,518c17,61,34,123,52,185,0-14,0-29,0-44,10,24,28,46,50,63-5-12-10-25-15-38,15,16,27,35,37,54-2-15,1-31,8-45,2,10,7,20,14,29,0-7-1-14-2-22,9,6,19,12,29,19-2-6-3-13-1-20,3,7,7,15,11,23,4-8,8-17,12-25,0,18,0,37,0,56,11-21,23-42,35-64,0,11,1,23,2,34,5-14,13-28,24-40,0,12-1,25-1,37,19-27,38-55,57-83-1,11-2,22-3,33,31-57,52-118,63-181-1,1-3,3-5,4"/></g> </g>'
    function addBody(string memory body) public returns (uint256 id) {
        bodies.push(body);
        return bodies.length - 1;
    }

    // Aminal #0 - Face
    // '<g id="Face_Mask"><rect class="cls-6" x="338" y="289" width="323" height="126" rx="63" ry="63"/> </g> <g id="Eyes"><g><circle class="cls-17" cx="388" cy="352" r="41"/><g><circle class="cls-12" cx="388" cy="352" r="38"/><circle class="cls-2" cx="367" cy="331" r="3"/><circle class="cls-2" cx="374" cy="325" r="1"/><ellipse class="cls-1" cx="387" cy="336" rx="28" ry="19"/></g><circle class="cls-19" cx="612" cy="352" r="41"/><g><circle class="cls-12" cx="612" cy="352" r="38"/><circle class="cls-2" cx="590" cy="331" r="3"/><circle class="cls-2" cx="597" cy="325" r="1"/><ellipse class="cls-1" cx="611" cy="336" rx="28" ry="19"/> </g></g> </g> <g id="nose"><g><circle class="cls-9" cx="495" cy="307" r="3"/><circle class="cls-9" cx="505" cy="307" r="3"/></g> </g>'

    function addFace(string memory face) public returns (uint256 id) {
        faces.push(face);
        return faces.length - 1;
    }

    // Aminal #0 - Mouth
    // '<g id="Mouth"><g><rect class="cls-12" x="461" y="335" width="77" height="45" rx="22" ry="22"/><path class="cls-7" d="m492,336c0,2-2,5-5,5s-5-2-5-5"/><path class="cls-7" d="m518,336c0,2-2,5-5,5s-5-2-5-5"/><circle class="cls-5" cx="499" cy="364" r="13"/><path class="cls-14" d="m485,380c0-8,7-12,14-12s14,4,14,12"/><path class="cls-13" d="m474,350c-2,2-3,5-4,8,0,3,0,6,1,9"/><path class="cls-13" d="m481,351c-2,2-3,5-4,8,0,3,0,6,2,8"/><path class="cls-13" d="m523,350c2,2,3,5,4,8,0,3,0,6-1,9"/><path class="cls-13" d="m516,351c2,2,3,5,4,8,0,3,0,6-2,8"/></g> </g> <g id="Element_1_OL"><path class="cls-6" d="m530,17l-51,83-8-20c16,1,65,7,81,9-10,11-55,65-67,78,0,0-9-20-9-20l66,5,17,1c-7,6-67,52-77,60,0,0,54-59,54-59l4,11c-20,1-76,6-96,8,13-15,57-67,71-83,0,0,8,20,8,20-18-2-67-7-84-9,12-11,76-72,89-84h0Z"/> </g>'
    function addMouth(string memory mouth) public returns (uint256 id) {
        mouths.push(mouth);
        return mouths.length - 1;
    }

    // Aminal #0 - Mouth
    // '<g id="Mouth"><g><rect class="cls-12" x="461" y="335" width="77" height="45" rx="22" ry="22"/><path class="cls-7" d="m492,336c0,2-2,5-5,5s-5-2-5-5"/><path class="cls-7" d="m518,336c0,2-2,5-5,5s-5-2-5-5"/><circle class="cls-5" cx="499" cy="364" r="13"/><path class="cls-14" d="m485,380c0-8,7-12,14-12s14,4,14,12"/><path class="cls-13" d="m474,350c-2,2-3,5-4,8,0,3,0,6,1,9"/><path class="cls-13" d="m481,351c-2,2-3,5-4,8,0,3,0,6,2,8"/><path class="cls-13" d="m523,350c2,2,3,5,4,8,0,3,0,6-1,9"/><path class="cls-13" d="m516,351c2,2,3,5,4,8,0,3,0,6-2,8"/></g> </g> <g id="Element_1_OL"><path class="cls-6" d="m530,17l-51,83-8-20c16,1,65,7,81,9-10,11-55,65-67,78,0,0-9-20-9-20l66,5,17,1c-7,6-67,52-77,60,0,0,54-59,54-59l4,11c-20,1-76,6-96,8,13-15,57-67,71-83,0,0,8,20,8,20-18-2-67-7-84-9,12-11,76-72,89-84h0Z"/> </g>'

    function addMisc(string memory misc) public returns (uint256 id) {
        miscs.push(misc);
        return miscs.length - 1;
    }

    // forgefmt: disable-start
    function getVisuals(uint256 category, uint256 id) public view returns (string memory) {
        if (VisualsCat(category) == VisualsCat.BACK) {
            if (backgrounds.length > id) { return backgrounds[id]; }
        } else if (VisualsCat(category) == VisualsCat.ARM) {
            if (arms.length > id) { return arms[id]; }
        } else if (VisualsCat(category) == VisualsCat.TAIL) {
             if (tails.length > id) { return tails[id]; }
        } else if (VisualsCat(category) == VisualsCat.EARS) {
            if (ears.length > id) { return ears[id]; }
        } else if (VisualsCat(category) == VisualsCat.BODY) {
            if (bodies.length > id) { return bodies[id]; }
        } else if (VisualsCat(category) == VisualsCat.FACE) {
            if (faces.length > id) { return faces[id]; }
        } else if (VisualsCat(category) == VisualsCat.MOUTH) {
            if (mouths.length > id) { return mouths[id]; }
        } else if (VisualsCat(category) == VisualsCat.MISC) {
            if (backgrounds.length > id) { return miscs[id]; }
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
