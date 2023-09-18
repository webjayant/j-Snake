import React, {useState, useEffect} from 'react';


const UserDropdown = ({currentUser, handleLogout, isLoggedin}) => {
    const [isDDOpen, setIsDDOpen] = useState(false)
    const [isLBOpen, setIsLBOpen] = useState(false)
    const [highScore, setHighScore] = useState(localStorage.getItem("highScore"))
    const [leaderBoard, setLeaderBoard] = useState([])
    const handleClick = () => {
        setIsDDOpen(!isDDOpen)
        setIsLBOpen(false)
    }

    useEffect(()=>{
        if(!isLoggedin){
            setHighScore(localStorage.getItem("highScore"))
        }
    },[localStorage.getItem("highScore")])

    const showLeaderBoard = () => {
        fetch('/.netlify/functions/score-board').then((response)=>{
            response.json().then((json)=>{
                setLeaderBoard(json)
            })
        })
        setIsLBOpen(!isLBOpen)
        setIsDDOpen(false)
    }
    return (
        <>
            {isLoggedin?<><div className="userDetails" onClick={()=>handleClick()}>
                <img src={isLoggedin&&currentUser?.avatar_url} alt="" />
            </div>
            <div className={`userDropdown ${isDDOpen?'open':null}`}>
                <img src={isLoggedin&&currentUser?.avatar_url} alt="" />
                <p>Name:{isLoggedin&&currentUser?.full_name}</p>
                <p>Highest Score: {highScore}</p>
                <button className='btn linkBtn' onClick={()=>handleLogout()}>Logout</button>
                <button className='btn linkBtn' onClick={()=>showLeaderBoard()}>Leader Board</button>
            </div></>:<button className='btn linkBtn' onClick={()=>showLeaderBoard()}>Leader Board</button>}
            <div className={`userDropdown scoreBoard ${isLBOpen?'open':null}`}>
                <p>Leader Board ({!isLoggedin&&'Login to join'})</p>
                {
                    leaderBoard.map((item, i)=>{
                        return <li key={item.data.email}>{item.data.email} : {item.data.score} {i===0&&'🥇'}{i===1&&'🥈'}{i===2&&'🥉'}</li>
                    })
                }
            </div>
        </>
    );
};


export default UserDropdown;
