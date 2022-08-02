import React, { useEffect, useState} from 'react'
import logo from '../assets/logo.png'
import { ethers } from 'ethers';
import { Popup } from "semantic-ui-react";

const WalletWindow = ({address,chainId,switchWallet}) => {
  
  const NETWORKS = {
    1: "Ethereum",
    3: "Ropsten",
    4: "Rinkeby",
    5: "Goerli",
    10: "Optimism",
    42: "Kovan",
    137: 'Polygon',
    42161: 'Arbitrum'
  };

  const addressCheckSummed = ethers.utils.getAddress(address);
  const chainName = NETWORKS[parseInt(chainId, 16)];

  return (
  <div className='flex flex-col space-y-4'>
    <Popup trigger={<button onClick={switchWallet} className='w-50 flex mx-1 p-1 space-x-1 rounded-2xl items-center bg-yellow-300'>
      <div className='m-2 font-extrabold'>
        {chainName}
      </div>
      <div className='font-bold px-1 py-2 border-4 rounded-xl hover:border-yellow-200 bg-white'>
        {`${addressCheckSummed.slice(0,5)}...${address.slice(-4,addressCheckSummed.lenght)}`}
      </div>
    </button>} position="bottom center">
      {<p className='bg-slate-100 rounded-xl mt-5 p-4 opacity-75'>Click to switch wallet</p>}
    </Popup>
  </div>
  )

}




const ConnectWallet = ({onClickConnect}) => {
  return (
    <button onClick={onClickConnect} className='font-extrabold p-2 bg-yellow-300 rounded-xl border-4 hover:border-green-400'>
      Connect Wallet
    </button>
  )

}

const Navbar = ({isConnect,onClickConnect,address,chainId}) => {

  return (
    <nav className='w-screen my-3 flex justify-between md:justify-around items-center'>
        <div className='flex flex-row items-center justify-center'>
          <div className='flex justify-center items-center bg-blue-300 w-16 p-2 rounded-full mx-2'>
            <img src={logo} alt="logo" className='w-7'/>
          </div>
          <div className='font-extrabold'>
            NFT Pokemon
          </div>
        </div>
        <div className='flex mx-2 items-center justify-end'>
          <div>
            {!isConnect ? <ConnectWallet onClickConnect={onClickConnect}/>:<WalletWindow switchWallet={onClickConnect} address={address} chainId={chainId}/>}
          </div>
        </div>  
    </nav>
  )
 }
  
  

export default Navbar
