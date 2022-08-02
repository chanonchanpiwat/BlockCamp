import { useState } from "react";
import { Item } from "semantic-ui-react";
import Deposit from "./Deposit";
import TransferTo from "./TransferTo";
import TransferToGroup from "./TransferToGroup";
import WithDraw from "./WithDraw";
import balanceOf from "../balanceOf";
import { ethers } from "ethers";
import { useEffect } from "react";

const token_adddress = "0x01BE77496a887Fd552E97ff4d32E9D1943F20679";
const bank_address = "0xC6D229545b5E0757E742de1AE88ef039645f3AA0";

const Account = ({name,accounts,userData,setUserData,index,transfer,setTransfer}) => {
    //console.log(userData[0].accounts)
    console.log(transfer)
    const [toggle,setToggle] = useState({deposit:false,transfer:false,transfergroup:false,withdraw:false});
    const [bankBalance,setBankBalance] = useState(userData[userData.length-1].bankBalance);
    const [tokenBalance,setTokenBalance] = useState(userData[userData.length-1].tokenBalance);
    

    const addressCheckSummed = ethers.utils.getAddress(accounts);
    const addressDisplay = `${addressCheckSummed.slice(0,5)}...${addressCheckSummed.slice(-4,addressCheckSummed.length)}`;

   

    useEffect(() => {
        let reccu = new Set()
        for (let i = 0; i < userData.length; i++){
            if (reccu.has(accounts)) {
                setUserData([...userData.slice(0,userData.length-1),{...userData[userData.length-1],allowance:0}]);
            } else {
                setUserData([...userData.slice(0,userData.length-1),{...userData[userData.length-1],allowance:bankBalance}])
                reccu.add( userData[i].accounts)
            }
        }
    },[])

    const handleToggle = (e) => {
        const {name} = e.target;
        setToggle({...toggle,[name]:!toggle[name]})
    }

    const handleGetBankBalance = async ({address,addressContract}) => {
       setBankBalance('Loading')
       const updatebankBalance= await balanceOf({address,addressContract});
       setBankBalance(updatebankBalance);
       
    }

    const handleGetTokenBalance = async ({address,addressContract}) => {
        console.log('tt',address,addressContract)
        setTokenBalance('Loading')
        const updatetokenBalance = await balanceOf({address,addressContract});
        setTokenBalance(updatetokenBalance);
        
     }


    const handleGetAllowance = () => {
        userData.forEach((item,index) => { 
            if (item.name === name) {
               item.allowance = bankBalance;
            }
        })

    }
    
    const buttonstyle = 'p-2 border-2 border-blue-100 rounded-md';
    return (
        <div className="m-8 p-4 flex flex-col items-center border-2 border-gray-800 rounded-md">
            <div>
                <div className="m-8 flex flex-row">
                    <div className="mx-1 flex font-bold">
                        Account Name:
                    </div> 
                    <div className="mx-2 w-20 px-1 font-bold text-right border-2 border-blue-400 rounded-md">
                        {name}
                    </div>
                    <div className="mx-1 flex font-bold">
                        Address:
                    </div> 
                    <div className="mx-2 px-2 font-bold border-2 border-blue-400 rounded-md">
                        {addressDisplay}
                    </div>
                </div>
                <div className="mx-8 my-4 flex items-center space-x-4">
                    <div className="flex flex-row font-bold">
                        Bank Balance: {bankBalance} shares
                    </div>
                    <button onClick={() => handleGetBankBalance({address:accounts,addressContract:bank_address})} className={buttonstyle}>refresh</button>
                    <div className="flex flex-row font-bold">
                        Token Balance: {tokenBalance} CCY
                    </div>
                    <button onClick={() => handleGetTokenBalance({address:accounts,addressContract:token_adddress})} className={buttonstyle}>refresh</button>
                </div>
                <div className="flex flex-row my-8 items-center">
                    <div className="mx-8 flex flex-row font-bold">
                            Allowance: {userData[index].allowance} shares
                    </div>
                    <button onClick={() => handleGetAllowance() } className={buttonstyle}>refresh</button>
                    </div>
                </div>
            <div className="flex flex-col items-center">
                <div className="flex space-x-7">
                    <button onClick={handleToggle} name='deposit' className={`${buttonstyle} ${toggle.deposit ? 'bg-green-200':'bg-slate-200'} `}>deposit</button>
                    <button onClick={handleToggle} name='transfer' className={`${buttonstyle} ${toggle.transfer ? 'bg-green-200':'bg-slate-200'} `}>transfer</button>
                    <button onClick={handleToggle} name='transfergroup' className={`${buttonstyle} ${toggle.transfergroup ? 'bg-green-200':'bg-slate-200'} `}>transfer group</button>
                    <button onClick={handleToggle} name='withdraw' className={`${buttonstyle} ${toggle.withdraw ? 'bg-green-200':'bg-slate-200'} `}>withdraw</button>
                </div>
                <div className="flex">
                    {toggle.deposit  && <Deposit/>}
                    {toggle.transfer  &&   <TransferTo {...{userData,index,setUserData,accounts,name,bankBalance,transfer,setTransfer}}/>}
                    {toggle.transfergroup  && <TransferToGroup {...{userData,setUserData,accounts,name,bankBalance}}/>}
                    {toggle.withdraw  && <WithDraw/>}
                </div>
            </div>
        </div>
        
    )
}




export default Account;