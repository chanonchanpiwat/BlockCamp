const { ethers } = require("ethers");

const INFURA_ID = 'a5f96620841c40638d9a4dc8dd08bb56'
const provider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${INFURA_ID}`)

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
];

//const address = '0x04663A86b90f5C28836b90C76dF7D77F89C76838'; // DAI Contract
const token_adddress = "0x01BE77496a887Fd552E97ff4d32E9D1943F20679";
const bank_address = "0xC6D229545b5E0757E742de1AE88ef039645f3AA0";

const balanceOf = async ({address,addressContract}) => {
    try {
        console.log(address,addressContract)
        const contract = new ethers.Contract(addressContract, ERC20_ABI, provider);
        const balance = await contract.balanceOf(address).then((data) => parseInt(data.toString()));
        return balance;
    } catch(err) {
        console.log(err)
        return false;
    }

}

export default balanceOf;
