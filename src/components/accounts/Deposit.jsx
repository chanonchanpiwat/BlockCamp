import deposit from "../deposit";
import { useState } from "react";

const Deposit = () => {
    const [amount,setAmount] = useState(0)
  
    const handleChange = (e) => {
      setAmount(e.target.value);
    }
    const handleSubmit = async (e) => {
      e.preventDefault();
      const result = deposit({amount:amount});
      console.log(result);
    }
  
    const roundedbox = 'm-2 p-2 text-center border-2 border-neutral-600 rounded-md';
    return ( 
      <form onSubmit={handleSubmit} className={`${roundedbox} flex flex-col justify-center items-center`}>
        <p className='font-bold'>Deposit</p>
        <div className='flex flex-row'>
          <input type="number" placeholder='amount' onChange={handleChange} min={0} required className={roundedbox}/>
          <p className={roundedbox}>CCY</p>
          <input type="submit" value="submit" className={roundedbox} />
        </div>
      </form>
  
    )
  }

export default Deposit;