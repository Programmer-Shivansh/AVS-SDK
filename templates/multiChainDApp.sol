// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiChainDApp {
    struct User {
        address userAddress;
        string data;
    }

    mapping(address => User) public users;

    function registerUser(string memory data) public {
        users[msg.sender] = User(msg.sender, data);
    }

    function getUserData(address userAddress) public view returns (string memory) {
        return users[userAddress].data;
    }
}
