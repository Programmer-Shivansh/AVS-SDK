// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataOracle {
    mapping(string => string) public dataFeeds;

    function updateDataFeed(string memory key, string memory value) public {
        dataFeeds[key] = value;
    }

    function getDataFeed(string memory key) public view returns (string memory) {
        return dataFeeds[key];
    }
}
