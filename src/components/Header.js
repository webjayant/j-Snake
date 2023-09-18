import React from 'react';
import UserDropdown from './userDropdown';
const Header = ({handleLogin, handleLogout, currentUser, isLoggedin}) => { 
    return (
        <div className='header'>
            <div className="logo">j~Snake</div>
            <div className="btnContainer">
                {
                    isLoggedin?
                    <>
                        <UserDropdown handleLogout={handleLogout} currentUser={currentUser} isLoggedin={isLoggedin}/>
                    </>:
                    <button className='btn login' onClick={()=>handleLogin()}>Login</button>
                }
            </div>
        </div>
    );
}

export default Header;
