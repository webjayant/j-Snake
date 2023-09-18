import React from 'react';
import UserDropdown from './userDropdown';
const Header = ({handleLogin, handleLogout, currentUser, isLoggedin}) => { 
    return (
        <div className='header'>
            <div className="logo">j~Snake</div>
            <div className="btnContainer">
                {!isLoggedin&&<button className='btn login' onClick={()=>handleLogin()}>Login</button>}
                <UserDropdown handleLogout={handleLogout} currentUser={currentUser} isLoggedin={isLoggedin}/>
            </div>
        </div>
    );
}

export default Header;
