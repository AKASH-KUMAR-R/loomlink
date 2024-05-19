import { createContext, useState } from "react";


const LoginContext = createContext();


export const LoginProvider = ({children}) => {

    const [loginStatus, setLoginStatus] = useState(window.sessionStorage.getItem('user_key') ? true : false);


    return (
        <LoginContext.Provider value={{loginStatus, setLoginStatus}}>
            {children}
        </LoginContext.Provider>
    );
};

export default LoginContext;