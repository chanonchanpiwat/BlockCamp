import { useState } from "react";
import Account from "./accounts/Account";


const AccountList = ({userData,setUserData}) => {
    const [transfer,setTransfer] = useState(false);

    return (
      <div>
        {userData.map(({name,accounts,allowance},index) => <Account key={index} {...{name,accounts,userData,setUserData,index,transfer,setTransfer}}/>)}
        <dir>{transfer && '.'}</dir>
      </div>
    )
  }

  export default AccountList;