// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SafeHavenBlockchain {
    struct Block {
        uint256 index;
        uint256 timestamp;
        string ipfsCID;  // Store IPFS CID instead of data
        string previousHash;
        string hash;
        uint256 nonce;
    }

    Block[] public chain;
    uint256 public difficulty = 4;

    constructor() {
        chain.push(Block({
            index: 0,
            timestamp: block.timestamp,
            ipfsCID: "Genesis Block",
            previousHash: "0",
            hash: "0",
            nonce: 0
        }));
    }

    function addBlock(string memory _ipfsCID) public {
        Block memory previousBlock = chain[chain.length - 1];
        uint256 newIndex = previousBlock.index + 1;
        uint256 newTimestamp = block.timestamp;
        string memory newPreviousHash = previousBlock.hash;
        uint256 newNonce = 0;
        string memory newHash = calculateHash(newIndex, newTimestamp, _ipfsCID, newPreviousHash, newNonce);

        while (!isValidHash(newHash)) {
            newNonce++;
            newHash = calculateHash(newIndex, newTimestamp, _ipfsCID, newPreviousHash, newNonce);
        }

        chain.push(Block({
            index: newIndex,
            timestamp: newTimestamp,
            ipfsCID: _ipfsCID,
            previousHash: newPreviousHash,
            hash: newHash,
            nonce: newNonce
        }));
    }

    function calculateHash(uint256 _index, uint256 _timestamp, string memory _ipfsCID, string memory _previousHash, uint256 _nonce) public pure returns (string memory) {
        return string(abi.encodePacked(_index, _timestamp, _ipfsCID, _previousHash, _nonce));
    }

    function isValidHash(string memory _hash) public view returns (bool) {
        bytes memory hashBytes = bytes(_hash);
        for (uint256 i = 0; i < difficulty; i++) {
            if (hashBytes[i] != "0") {
                return false;
            }
        }
        return true;
    }

    function getChainLength() public view returns (uint256) {
        return chain.length;
    }

    function getBlock(uint256 _index) public view returns (Block memory) {
        return chain[_index];
    }
} 