import React from 'react';
const Header = ({handleLogin}) => { 
    return (
        <div className='header'>
            <div className="logo">j~Snake</div>
            <div className="btnContainer">
                <button className='btn login' onClick={()=>handleLogin()}>Login</button>
            </div>
        </div>
    );
}

export default Header;
