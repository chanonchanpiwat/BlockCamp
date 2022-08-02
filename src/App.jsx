import logo from './logo.svg';
import './App.css';
import { Navbar, Main } from './components/index'
import { useState, useEffect} from 'react'
import { use } from 'chai';
//import { Main }   from './components/Main.jsx';

import deposit from './components/deposit';
import transferTo from './components/transferTo';
import transferToGroup from './components/transferToGroup';
import withDraw from './components/withDraw';
import { IoIosAddCircle } from 'react-icons/io';
import Account from './components/accounts/Account';
import balanceOf from './components/balanceOf';
import { ethers } from 'ethers';



const Box = 'text-center items-center border border-black'
const App = () => {

  const [address,setAddress] = useState(null);
  const [chainId,setChainId] = useState(null);
  const [isConnect,setIsConnect] = useState(false);
  

  const onClickConnect = async () => {
    try {
      await window.ethereum.request({method: "wallet_requestPermissions",params: [{eth_accounts: {}}]})
      const [accounts,chainId] = await Promise.all([window.ethereum.request({ method: "eth_requestAccounts" }),window.ethereum.request({ method: "eth_chainId" })]);
      await window.ethereum.request({method: 'wallet_switchEthereumChain',params: [{ chainId: '0x4' }]})
      console.log('login')
      setAddress(accounts[0]);
      setChainId(chainId);
      setIsConnect(true);
    } catch (error) {
      alert('window.ethereum is not found');
    }
  }
  
  //only handleAccountsChange is triggered when metamsk is disconnected
  const handleAccountsChange = (accounts) => {
    //catch null accounts
    if (accounts[0] == null) {
      console.log('logout')
      setIsConnect(false);
      setAddress(null);
      setChainId(null);
    }
    //catch other account
    else {
      console.log('changeAccount')
      setAddress(accounts[0]);
    }

  }

  //chainChange is not triggered when user logout
  const chainChange = (chainId) => {
    console.log(chainId)
    if (chainId.lenght !== 0) {
      setChainId(chainId);
    } 
  }

  useEffect(() => {
    // accounts and chainId is passed into to callback function
    if (isConnect) {
      window.ethereum.on('accountsChanged', handleAccountsChange);
      window.ethereum.on('chainChanged',chainChange);
    }
    return  () => { 
      if (isConnect) {
        window.ethereum.removeListener('accountsChanged',handleAccountsChange);
        window.ethereum.removeListener('chainChanged',chainChange);
      }
  }}
    ,[isConnect])

  return (
    <div className='flex flex-col justify-center items-center' >
      <Navbar {...{isConnect,onClickConnect,address,chainId}}/>
      <div className='mt-8 min-h-screen flex flex-col justify-start'>
        {isConnect ? <Main {...{address}}/>:<button onClick={onClickConnect} className='p-2 w-50 font-bold bg-lime-200 hover:bg-green-100 rounded-md'>Connect Wallet</button> }
      </div>
    </div>
  );
}
















// const Main = ({address=''}) => {
//   const [userData,setUserData] = useState([]);
//   return(
//     <main className='flex flex-col w-full items-center'>
//         <From {...{address,userData,setUserData}}/>
//       <div>
//         <AccountList {...{userData,setUserData}}/>
//       </div>
//     </main>
//   )}
  
  
// const token_adddress = "0x01BE77496a887Fd552E97ff4d32E9D1943F20679";
// const bank_address = "0xC6D229545b5E0757E742de1AE88ef039645f3AA0";


// const From = ({address,userData,setUserData}) => {
//   const [userInput,setUserInput] = useState({name:'',accounts:address,bankBalance:'',tokenBalance:'',allowance:0});
  


//   useEffect(() => {
//     setUserInput({...userInput,accounts:address});
//   },[address]) 

//   useEffect(() => {
//    const fetch = async () => {
//       const [bankBalance,tokenBalance] = await Promise.all([balanceOf({address:address,addressContract:bank_address}),balanceOf({address:address,addressContract:token_adddress})])
//       setUserInput({...userInput,bankBalance:bankBalance,tokenBalance:tokenBalance,allowance:0})
//     } 
//     fetch();
//   },[userInput.accounts]) 


//   const handleChange = (e) => {
//     const {name ,value} = e.target
//     setUserInput({...userInput,[name]:value});
//   }

//   const handleAddUser = (e) => {
//     e.preventDefault();
//     setUserData((userData) => [...userData,userInput]);
//     setUserInput({name:'',accounts:address,bankBalance:userInput.bankBalance,tokenBalance:userInput.bankBalance});
//   }
  
//   const addressCheckSummed = ethers.utils.getAddress(address);
//     const addressDisplay = `${addressCheckSummed.slice(0,5)}...${addressCheckSummed.slice(-4,addressCheckSummed.length)}`;

//     return (
//       <form onSubmit={handleAddUser} className='p-16 font-bold flex items-center border-4 border-slate-800 border-dashed rounded-md space-x-4'>
//         <label htmlFor="name">Account Name:</label>
//         <input type="text" name='name' placeholder='name' value={userInput.name} onChange={handleChange} required/>
//         <input type="text" value={userInput.accounts} className='hidden' readOnly/>
//         <label htmlFor="address">Address:</label>
//         <div className='font-bold'>
//           {addressDisplay}
//         </div>
//         <input type='submit' name='Save' value="Create" className='p-2 bg-lime-200 hover:bg-green-100 rounded-md'/>
//       </form>
//     )
//   }


//   const AccountList = ({userData,setUserData}) => {
//     const [transfer,setTransfer] = useState(false);

//     return (
//       <div>
//         {userData.map(({name,accounts,allowance},index) => <Account key={index} {...{name,accounts,userData,setUserData,index,transfer,setTransfer}}/>)}
//         <dir>{transfer && '.'}</dir>
//       </div>
//     )
//   }









export default App;
