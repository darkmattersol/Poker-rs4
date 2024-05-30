// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RC4 {
    function encryptBytes32(
        bytes32 input,
        bytes32 key
    ) public pure returns (bytes32 output) {
        bytes memory input_bytes = abi.encodePacked(input);
        bytes memory key_bytes = abi.encodePacked(key);

        bytes memory output_bytes = encryptBytes(
            input_bytes,
            key_bytes
        );

        assembly {
            output := mload(add(output_bytes, 32))
        }
    }

    function encryptBytes(
        bytes memory input,
        bytes memory key
    ) public pure returns (bytes memory output) {
        //Generate Key Schedule State
        bytes memory state = abi.encodePacked(
            uint(
                0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
            ),
            uint(
                0x202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f
            ),
            uint(
                0x404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f
            ),
            uint(
                0x606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f
            ),
            uint(
                0x808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f
            ),
            uint(
                0xa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebf
            ),
            uint(
                0xc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedf
            ),
            uint(
                0xe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff
            )
        );

        unchecked {
            uint8 m = 0;
            uint keylen = key.length;
            uint i = 0;
            for (; i < 256; i++) {
                m = m + uint8(state[i]) + uint8(key[i % keylen]);

                bytes1 temp1 = state[i];
                state[i] = state[m];
                state[m] = temp1;
            }

            //Get Keystream and XOR with input
            output = new bytes(input.length);

            uint8 n = 0;
            m = 0;
            for (i = 0; i < input.length; i++) {
                //Adjust n and m
                n++;
                m += uint8(state[n]);

                //Swap state
                bytes1 temp1 = state[n];
                state[n] = state[m];
                state[m] = temp1;

                uint8 temp2 = uint8(state[n]) + uint8(state[m]);
                temp2 = uint8(state[temp2]);
                temp2 ^= uint8(input[i]);
                output[i] = bytes1(uint8(temp2));
            }
        }
    }
}