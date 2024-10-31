// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ConsensusEngine {
    struct Validator {
        address addr;
        uint256 stake;
        bool isActive;
    }
    
    mapping(address => Validator) public validators;
    mapping(bytes32 => mapping(address => bool)) public validations;
    mapping(bytes32 => uint256) public validationCounts;
    
    uint256 public requiredValidations;
    
    event ValidationSubmitted(bytes32 indexed dataId, address validator);
    event ConsensusReached(bytes32 indexed dataId);
    
    constructor(uint256 _requiredValidations) {
        requiredValidations = _requiredValidations;
    }
    
    function registerValidator() public payable {
        require(msg.value > 0, "Stake required");
        validators[msg.sender] = Validator(msg.sender, msg.value, true);
    }
    
    function submitValidation(bytes32 dataId) public {
        require(validators[msg.sender].isActive, "Not an active validator");
        require(!validations[dataId][msg.sender], "Already validated");
        
        validations[dataId][msg.sender] = true;
        validationCounts[dataId]++;
        
        emit ValidationSubmitted(dataId, msg.sender);
        
        if (validationCounts[dataId] >= requiredValidations) {
            emit ConsensusReached(dataId);
        }
    }
}
