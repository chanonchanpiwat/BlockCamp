import transferTo from "../transferTo";
import { useState } from "react";
import { useEffect } from "react";



const TransferTo = ({userData,index,setUserData,accounts,name,transfer,setTransfer}) => {
    const [amount,setAmount] = useState(0)
    const [receiver,setReceiver] = useState('')
    

    const ownerAddress = accounts;

    
    const foundAccounts = userData.filter((item) => {return item.name === receiver && item.name !== name});
    const handleChangeAmount = (e) => {
      setAmount(e.target.value);
    }
  
    const handleChangeReciver= (e) => {
      setReceiver(e.target.value);
    }
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (foundAccounts.length !==0 ) {
        if (foundAccounts.length !== 0 && foundAccounts[0].accounts !== ownerAddress ) {
          const result = await transferTo({address:foundAccounts[0].accounts,amount:amount})
          console.log(result)
        } else if(foundAccounts[0].accounts === ownerAddress) {
          console.log('transfer between same accounts')
          setTransfer(!transfer);
          console.log(transfer)

          if (amount <= userData[index].allowance){
          userData.forEach((item,index) => { 
            if (item.name === name) {
               item.allowance = parseInt(item.allowance)-parseInt(amount)
            }
            else if (item.name === receiver) {
               item.allowance = parseInt(item.allowance)+parseInt(amount)
            }})
            setUserData(userData);}
            else {
              alert('you cannot transfer more than your allownace')
            }

            // return (item.name === receiver && item.name !== name) ? item.allowance = parseInt(item.allowance)+parseInt(amount) : null});
         
          //console.log(foundAcnts)          
         // setUserData([...userData.slice(0,userData.length-1),{...userData[userData.length-1],allowance:0}]);
        }
      }
      else {
        alert('recipient is not found')
      }
 
      
      
    }
    console.log(userData[index].allowance)
    const roundedbox = 'm-2 p-2 text-center border-2 border-neutral-600 rounded-md';
    return ( 
      <form onSubmit={handleSubmit} className={`${roundedbox} flex flex-col justify-center items-center`}>
        <p className='font-bold'>Transfer</p>
        <div className='flex flex-col items-center justify-center'>
          <div>
            <label htmlFor="receiver">To:</label>
            <input type="text" name='receiver' placeholder='receiver' className={`${roundedbox} ${foundAccounts.length !== 0 ? 'bg-emerald-200':'bg-stone-300'}`} onChange={handleChangeReciver}  required value={receiver}/>
            </div>
          <div className="flex justify-center">
            <input type="number" name='amount' placeholder='amount' onChange={handleChangeAmount} min={0} required className={roundedbox}/>
            <p className={roundedbox}>CCY</p>
            <input type="submit" value="submit" className={roundedbox} />
          </div>
        </div>
      </form>
  
    )
  }


  export default TransferTo;