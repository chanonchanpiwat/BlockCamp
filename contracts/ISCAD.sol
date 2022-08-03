// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ISCAD {

    event Propose(address indexed proposer, bytes32 _data, uint _period, bytes32 _package, uint proposalId);
    event Approve(address indexed governer, uint proposalId);
    event Reject(address indexed governer, uint proposalId);
    event Claim(address[] indexed recipients, uint proposalId);
    
    enum Status {
        pending,
        aprroved,
        rejected
    }

    struct Proposal {
        address proposer;
        bytes32 data;
        uint start;
        uint256 period;
        Status state;
        uint8 bounty;
    }

    function propose(address client, bytes32 _data, uint _period, uint _amount) external view;

    function reject(uint proposalId, uint _amount) external view;

    function approve(uint propsalId, uint _amount) external view;

    function claimProposalReward (address[] calldata recipients, uint proposalId, uint[] calldata weight, uint propsalId) external view;

}