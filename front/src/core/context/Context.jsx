import {createContext, useState} from "react";
const AppContext = createContext({});

const AppProvider = ({ children }) => {

    const[wallet, setWallet] = useState("");

    const login = async() => {
        const account = await window.ethereum.request({method: "eth_requestAccounts"});
        const walletAddress = account[0];
        setWallet(walletAddress);
        console.log(walletAddress);
    }

    const logOut = async() => {
       await setWallet("");
    }

    const values = {
        wallet,
        login,
        logOut,
    }

   return <AppContext.Provider value={values}> {children} </AppContext.Provider>
}

export { AppProvider, AppContext };