import React, {useState} from 'react';


const UserDropdown = ({currentUser, handleLogout}) => {
    const [isDDOpen, setIsDDOpen] = useState(false)
    const handleClick = () => {
        setIsDDOpen(!isDDOpen)
    }
    const showLeaderBoard = () => {
        fetch('/.netlify/functions/score-board').then((response)=>{
            console.log(response)
        })
    }
    return (
        <>
            <div className="userDetails" onClick={()=>handleClick()}>
                <img src={currentUser.avatar_url} alt="" />
            </div>
            <div className={`userDropdown ${isDDOpen?'open':null}`}>
                <img src={currentUser.avatar_url} alt="" />
                <p>Name:{currentUser.full_name}</p>
                <p>Highest Score: xxx</p>
                <button className='btn linkBtn' onClick={()=>handleLogout()}>Logout</button>
                <button className='btn linkBtn' onClick={()=>showLeaderBoard()}>Leader Board</button>
            </div>
            
        </>
    );
};


export default UserDropdown;
