import { useState,useEffect } from "react";
import balanceOf from "./balanceOf";
import { ethers } from "ethers";

const token_adddress = "0x01BE77496a887Fd552E97ff4d32E9D1943F20679";
const bank_address = "0xC6D229545b5E0757E742de1AE88ef039645f3AA0";


const Form = ({address,userData,setUserData}) => {
    const [userInput,setUserInput] = useState({name:'',accounts:address,bankBalance:'',tokenBalance:'',allowance:0});
    
  
  
    useEffect(() => {
      setUserInput({...userInput,accounts:address});
    },[address]) 
  
    useEffect(() => {
     const fetch = async () => {
        const [bankBalance,tokenBalance] = await Promise.all([balanceOf({address:address,addressContract:bank_address}),balanceOf({address:address,addressContract:token_adddress})])
        setUserInput({...userInput,bankBalance:bankBalance,tokenBalance:tokenBalance,allowance:0})
      } 
      fetch();
    },[userInput.accounts]) 
  
  
    const handleChange = (e) => {
      const {name ,value} = e.target
      setUserInput({...userInput,[name]:value});
    }
  
    const handleAddUser = (e) => {
      e.preventDefault();
      setUserData((userData) => [...userData,userInput]);
      setUserInput({name:'',accounts:address,bankBalance:userInput.bankBalance,tokenBalance:userInput.bankBalance});
    }
    
    const addressCheckSummed = ethers.utils.getAddress(address);
      const addressDisplay = `${addressCheckSummed.slice(0,5)}...${addressCheckSummed.slice(-4,addressCheckSummed.length)}`;
  
      return (
        <form onSubmit={handleAddUser} className='p-16 font-bold flex items-center border-4 border-slate-800 border-dashed rounded-md space-x-4'>
          <label htmlFor="name">Account Name:</label>
          <input type="text" name='name' placeholder='name' value={userInput.name} onChange={handleChange} required/>
          <input type="text" value={userInput.accounts} className='hidden' readOnly/>
          <label htmlFor="address">Address:</label>
          <div className='font-bold'>
            {addressDisplay}
          </div>
          <input type='submit' name='Save' value="Create" className='p-2 bg-lime-200 hover:bg-green-100 rounded-md'/>
        </form>
      )
    }
  

export default Form;