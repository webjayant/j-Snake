import React, {useState, useEffect} from 'react';


const UserDropdown = ({currentUser, handleLogout, isLoggedin}) => {
    const [isDDOpen, setIsDDOpen] = useState(false)
    const [isLBOpen, setIsLBOpen] = useState(false)
    const [highScore, setHighScore] = useState(localStorage.getItem("highScore"))
    const [leaderBoard, setLeaderBoard] = useState([])
    const handleClick = () => {
        setIsDDOpen(!isDDOpen)
    }

    useEffect(()=>{
        setHighScore(localStorage.getItem("highScore"))
    },[localStorage.getItem("highScore")])

    const showLeaderBoard = () => {
        fetch('/.netlify/functions/score-board').then((response)=>{
            console.log(response.body.data)
            setLeaderBoard(response.body)
        })
        setIsLBOpen(true)
        setIsDDOpen(false)
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
            <div className={`userDropdown ${isLBOpen?'open':null}`}>
                {
                    leaderBoard.map((item)=>{
                        return <li key={item.email}>{item.email}:{item.score}</li>
                    })
                }
            </div>
        </>
    );
};


export default UserDropdown;
