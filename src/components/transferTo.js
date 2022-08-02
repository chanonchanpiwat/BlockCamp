const { ethers } = require("ethers");

const ABI = [
    "function TransferTo(address, uint) payable external",
    "function TransferToGroup(address[] calldata addresses,uint _shares) payable external",
    "function withdraw(uint _shares) external"
];
const Bank_address = "0xC6D229545b5E0757E742de1AE88ef039645f3AA0";

const transferTo = async ({address,amount}) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
        Bank_address,
        ABI,
        signer,
    );

    try {
        console.log(address,amount)
        const tx = await contract.TransferTo(address,ethers.BigNumber.from(amount));
        await tx.wait();
        console.log(tx);
        return {completed:true,reason:"transcation completed"};
    }   catch(err){
        console.log("error: ",err)
        return {completed:false,reason:err.reason};
    }
}

export default transferTo;