import { useState } from "react";
import Form from "./Form";
import AccountList from "./AccountList";

const Main = ({address=''}) => {
    const [userData,setUserData] = useState([]);
    return(
      <main className='flex flex-col w-full items-center'>
          <Form {...{address,userData,setUserData}}/>
        <div>
          <AccountList {...{userData,setUserData}}/>
        </div>
      </main>
    )}

export default Main;