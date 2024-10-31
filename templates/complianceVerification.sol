// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ComplianceVerification {
    struct Verification {
        address verifier;
        string data;
        bool isVerified;
    }

    mapping(bytes32 => Verification) public verifications;

    function verifyData(bytes32 id, string memory data) public {
        verifications[id] = Verification(msg.sender, data, true);
    }

    function getVerification(bytes32 id) public view returns (Verification memory) {
        return verifications[id];
    }
}
