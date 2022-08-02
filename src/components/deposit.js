const { ethers } = require("ethers");

const Bank_ABI = [
    "function TranferTo(address, uint) payable external",
    "function TransferToGroup(address[] calldata addresses,uint _shares) payable external",
    "function deposit(uint) external",
    "function withdraw(uint _shares) external"
];

const Token_ABI = [
    "function approve(address, uint) external"
];

const Bank_address = "0xC6D229545b5E0757E742de1AE88ef039645f3AA0";

const deposit = async ({amount,Token_address="0x01BE77496a887Fd552E97ff4d32E9D1943F20679"}) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const Token_contract = new ethers.Contract(
        Token_address,
        Token_ABI,
        signer,
    )
    const Bank_contract = new ethers.Contract(
        Bank_address,
        Bank_ABI,
        signer,
    );

    try {
        const tx_approve = await Token_contract.approve(Bank_address,ethers.BigNumber.from(amount));
        await tx_approve.wait();
        const tx = await Bank_contract.deposit(ethers.BigNumber.from(amount));
        await tx.wait();
        console.log(tx);
        return {completed:true,reason:"transcation completed"};
    }   catch(err){
        console.log("error: ",err)
        return {completed:false,reason:err.reason};
    }
}

export default deposit;