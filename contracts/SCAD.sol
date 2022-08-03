// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";



contract SCAD is AccessControl {

    event Propose(address indexed sender, uint proposalId);
    event Approve(address indexed sender, uint proposalId);
    event Refund(address indexed sender, uint amount);
    event Reward(address[] indexed inspector, uint proposalId, uint reward);

    IERC20 token;
    mapping(address => uint) balanceOf;
    mapping(uint => Proposal) proposalQuene;
    bytes32 public constant APPROVER_ROLE = keccak256("APPROVER");

    enum Status {
        pending,
        aprroved,
        rejected
    }

    struct Proposal {
        address proposer;
        string data;
        uint start;
        uint period;
        Status state;
        uint bounty;
    }

    constructor(address[] memory approver, address _token) {
        token = IERC20(_token);
        for (uint256 i = 0; i < approver.length; ++i) {
            _setupRole(APPROVER_ROLE, approver[i]);
        }
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

    function propose(string memory contractName, uint _period, uint _amount) external returns(uint)  {
        uint proposalId = uint(keccak256(abi.encodePacked(msg.sender,contractName,_period)));
        _deposit(_amount);
        proposalQuene[proposalId] = Proposal({
            proposer: msg.sender,
            data: contractName,
            start: block.timestamp,
            period: _period,
            state: Status.pending,
            bounty: _amount
        });
        emit Propose(msg.sender,proposalId);
        return proposalId;
    }


    function approve(uint proposalId) external onlyApprover {
        Proposal storage proposal = proposalQuene[proposalId];
        require(proposal.proposer == msg.sender, "Can only approved your proposal");
        proposal = proposalQuene[proposalId];
        proposal.state = Status.aprroved;
        emit Approve(msg.sender, proposalId);
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

    function _refund(uint _amount) internal {
        token.transfer(msg.sender, _amount);
        emit Refund(msg.sender, _amount);

    }

    function refund(uint proposalId) external {
        Proposal storage proposal = proposalQuene[proposalId];
        require(proposal.proposer == msg.sender, "can withdraw only your deposition");
        uint amount = proposal.bounty;
        if (proposal.state == Status.rejected) {
            _refund(amount);
        } else if (proposal.start + proposal.period > block.timestamp) {
            _refund(amount);
        } else if (proposal.start + 2 > block.timestamp) {
            _refund(amount);
        } else {
            revert("contract are under audited process");
        }
    }

}