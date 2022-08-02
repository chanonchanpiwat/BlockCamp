import transferToGroup from "../transferToGroup";
import { useState } from "react";

const TransferToGroup = ({userData,accounts,name,bankBalance,setBankBalance}) => {
    const [amount,setAmount] = useState(0)
    const [userInput,setUserInput] = useState('');
    const [friendList,setFriendList] = useState([]);
    const [addressList,setAddressList] = useState([])

    const ownerAddress = accounts;

    const foundAccounts = userData.filter((item) => {return item.name === userInput && item.name !== name});
    
    const handleChangeAmount = (e) => {
      setAmount(e.target.value);
    }
  
    const handleChange = (e) => {
      const {name ,value} = e.target
      setUserInput(value);
    }
   
    const handleAddUser = (e) => {
      e.preventDefault();

      if (foundAccounts.length !== 0) {
        if (foundAccounts.length !== 0 && foundAccounts[0].accounts !== ownerAddress) {
          setFriendList((friendList) => [...friendList,userInput])
          setAddressList((addressList) => [...addressList,foundAccounts[0].accounts])
          setUserInput('');}
        else if (foundAccounts[0].accounts === ownerAddress){
          alert('this is your wallet');
        }
      }
      else if (foundAccounts.length === 0 ) {
        alert('account is not found');
      }
  
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (addressList.length !== 0){
        const result = await transferToGroup({address:addressList,amount:amount});
        console.log(result);
      } else {
        alert('you need to add recipient to the list')
      }
    }
  
    const roundedbox = 'm-2 p-2 text-center border-2 border-neutral-600 rounded-md';
    return(
      <div className={`${roundedbox}`}>
        <h2 className='font-bold'>TransferTo</h2>
        <form onSubmit={handleAddUser} className='flex items-center justify-center' >
          <label htmlFor="receiver">To:</label>
          <input type="text" name='address' placeholder='reciever' onChange={handleChange} value={userInput} required className={`${roundedbox} ${foundAccounts.length !== 0 ? 'bg-emerald-200':'bg-stone-300'}`}/>
          <input type="submit" value='add' />
        </form>
        <div className='grid grid-cols-3'>
          {friendList.map((item) => <div>{item}</div>)}
        </div>
        <form onSubmit={handleSubmit} className='flex flex-row'>
          <input type="number" name='amount' placeholder='amount' onChange={handleChangeAmount} min={0}     required className={roundedbox}/>
          <p className={roundedbox}>CCY</p>
          <input type="submit" value="submit" className={roundedbox} />
        </form>
      </div>
    )
  }



  export default TransferToGroup;