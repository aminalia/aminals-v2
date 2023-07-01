/// @title A library used to construct ERC721 token URIs and SVG images
/// @dev From the Nouns NFT descriptor

pragma solidity ^0.8.20;

import {Base64} from "../utils/Base64.sol";

contract NFTDescriptor {
    struct TokenURIParams {
        string name;
        string description;
        string image;
        string attributes;
    }

    /**
     * @notice Construct an ERC721 token URI.
     */
    function constructTokenURI(TokenURIParams memory params) public pure returns (string memory) {
        // prettier-ignore
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
}
