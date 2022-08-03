// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./ISCAD.sol";


contract SCAD is ISCAD, IERC20 {
    IERC20 token;
    mapping(address => uint) balanceOf;
    mapping(uint => Proposal) proposalQuene;

    enum Status {
        pending,
        aprroved,
        rejected
    }

    struct Proposal {
        address proposer;
        bytes data;
        uint start;
        uint period;
        Status state;
        uint bounty;
    }

    constructor(address _token) {
        token = IERC20(_token);
    }

    function _deposit(uint _amount) internal {
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient token balance");
        require(token.allowance(msg.sender ,address(this)) >= _amount,"Contract must be approved");
        token.transferFrom(msg.sender, address(this), _amount);
        balanceOf[msg.sender] += _amount;
        
    }


    function propose(address client, bytes memory _data, uint _period, uint _amount) external view onlyOwner override{
        uint proposalID = uint(keccak256(abi.encodePacked(client,_data,_period)));
        proposalQuene[proposalID] = Proposal({
            proposer: client,
            data: _data,
            start: block.timestamp,
            period: _period,
            state: Status.pending,
            bounty: _amount
        });

    }


    function approve(uint propsalId, uint _amount) external onlyOwner {
        require(proposalQuene[propsalId], "Proposal does not exist");
        proposal = proposalQuene[prosalId];
        require(proposal.proposer = msg.sender, "Can only approved your proposal");
        _deposit(_amount);
        proposal = proposalQuene[prosalId];
        proposal.bounty = _amount;
        proposal.start = block.timestamp;
        proposal.state = Status.aprroved;
    }


    function claimProposalReward(address[] calldata recipients, uint proposalId) external onlyOwner {
        require(proposalQuene[prosalId].start = block.timestamp + proposalQuene[prosalId].period,"Out of time");
        require(proposalQuene[prosalId].state = 1,"Proposal must be approved");
        uint reward = proposalQuene[prosalId].bounty/recipients.lenght;
        for(uint i=0; i < recipients.lenght; i++){
            recipients[i] += reward;
        }
    }

    function withDraw(uint _amount) external {
        require(balanceOf[msg.sender] >= _amount);
        balanceOf[msg.sender] -= _amount;
        token.transfer(msg.sender, amount);
    }

}