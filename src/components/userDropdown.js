import React, {useState, useEffect} from 'react';


const UserDropdown = ({currentUser, handleLogout, isLoggedin}) => {
    const [isDDOpen, setIsDDOpen] = useState(false)
    const [highScore, setHighScore] = useState(localStorage.getItem("highScore"))
    const handleClick = () => {
        setIsDDOpen(!isDDOpen)
    }

    useEffect(()=>{
        setHighScore(localStorage.getItem("highScore"))
    },[localStorage.getItem("highScore")])

    const showLeaderBoard = () => {
        
    }
    return (
        <>
            <div className="userDetails" onClick={()=>handleClick()}>
                <img src={isLoggedin&&currentUser?.avatar_url} alt="" />
            </div>
            <div className={`userDropdown ${isDDOpen?'open':null}`}>
                <img src={isLoggedin&&currentUser?.avatar_url} alt="" />
                <p>Name:{isLoggedin&&currentUser?.full_name}</p>
                <p>Highest Score: {highScore}</p>
                <button className='btn linkBtn' onClick={()=>handleLogout()}>Logout</button>
                <button className='btn linkBtn' onClick={()=>showLeaderBoard()}>Leader Board</button>
            </div>
            
        </>
    );
};


export default UserDropdown;
