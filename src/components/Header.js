import React, { useEffect, useState } from 'react';
import UserDropdown from './userDropdown';
const Header = ({handleLogin, handleLogout, currentUser}) => { 
    const [isLoggedin, setIsLoggedin] = useState(false)
    useEffect(()=>{
        if(currentUser && currentUser.id){
            setIsLoggedin(true)
        }
    },[currentUser])
    return (
        <div className='header'>
            <div className="logo">j~Snake</div>
            <div className="btnContainer">
                {
                    !isLoggedin?
                    <>
                        <UserDropdown handleLogout={handleLogout} currentUser={currentUser}/>
                    </>:
                    <button className='btn login' onClick={()=>handleLogin()}>Login</button>
                }
            </div>
        </div>
    );
}

export default Header;
