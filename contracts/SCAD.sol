// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";



contract SCAD is AccessControl {

    event Propose(address indexed sender, uint proposalId);
    event Approve(address indexed sender,uint proposalId,uint amount);
    event Refund(address indexed sender,uint proposalId,uint amount);
    event Reward(address[] indexed inspector, uint proposalId, uint reward);

    IERC20 token;
    mapping(address => uint) balanceOf;
    mapping(uint => Proposal) proposalQuene;
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER");
    bytes32 public constant APPROVER_ROLE = keccak256("APPROVER");

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

    constructor(address[] memory proposer, address[] memory approver, address _token) {
        token = IERC20(_token);
        for (uint256 i = 0; i < proposer.length; ++i) {
            _setupRole(PROPOSER_ROLE, proposer[i]);
        }

        for (uint256 i = 0; i < approver.length; ++i) {
            _setupRole(PROPOSER_ROLE, approver[i]);
        }
    }


    modifier onlyProposer {
      require(hasRole(PROPOSER_ROLE, msg.sender),"Proposer role is required");
      _;
   }

   modifier onlyApprover {
      require(hasRole(APPROVER_ROLE, msg.sender),"Approver role is required");
      _;
   }

    function _deposit(uint _amount) internal {
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient token balance");
        require(token.allowance(msg.sender ,address(this)) >= _amount,"Contract must be approved");
        token.transferFrom(msg.sender, address(this), _amount);
        
        
    }

    function propose(address client, string memory func, uint _period, uint _amount) external onlyProposer {
        bytes memory _data = abi.encodePacked(func);
        uint proposalId = uint(keccak256(abi.encodePacked(client,_data,_period)));
        proposalQuene[proposalId] = Proposal({
            proposer: client,
            data: _data,
            start: block.timestamp,
            period: _period,
            state: Status.pending,
            bounty: _amount
        });
        emit Propose(msg.sender,proposalId);

    }


    function approve(uint proposalId, uint _amount) external {
        Proposal storage proposal = proposalQuene[proposalId];
        require(proposal.proposer == msg.sender, "Can only approved your proposal");
        _deposit(proposal.bounty);
        proposal = proposalQuene[proposalId];
        proposal.bounty = _amount;
        proposal.start = block.timestamp;
        proposal.state = Status.aprroved;
        emit Approve(msg.sender, proposalId, _amount);
    }


    function unlockReward(address[] calldata recipients, uint proposalId) external onlyApprover {
        require(proposalQuene[proposalId].start <= block.timestamp + proposalQuene[proposalId].period,"Out of time");
        require(proposalQuene[proposalId].state == Status.aprroved,"Proposal must be approved");
        uint reward = proposalQuene[proposalId].bounty/recipients.length;
        for(uint i=0; i < recipients.length; i++){
            balanceOf[recipients[i]] += reward;
        }
        emit Reward(recipients, proposalId, reward);
    }

    function withDraw(uint _amount) external {
        require(balanceOf[msg.sender] >= _amount);
        balanceOf[msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);
    }

    function refund(uint proposalId) external {
        Proposal storage proposal = proposalQuene[proposalId];
        require(proposal.proposer == msg.sender, "Can only approved your proposal");
        require(proposal.start + proposal.period > block.timestamp,"Your contract are under audited");
        token.transfer(msg.sender, proposal.bounty);
        emit Refund(msg.sender, proposalId, proposal.bounty);

    }

}