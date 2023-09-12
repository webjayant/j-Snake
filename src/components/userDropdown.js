import React, {useState} from 'react';


const UserDropdown = ({currentUser, handleLogout}) => {
    const [isDDOpen, setIsDDOpen] = useState(false)
    const handleClick = () => {
        setIsDDOpen(!isDDOpen)
    }
    const showLeaderBoard = () => {

    }
    return (
        <>
            <div className="userDetails" onClick={()=>handleClick()}>
                <img src="https://lh3.googleusercontent.com/a/ACg8ocL-VBCznRMPJ183d-Y1liSWfH0esgFWGd5yBPSVF2NtlBQe=s96-c" alt="" />
            </div>
            <div className={`userDropdown ${isDDOpen?'open':null}`}>
                <img src="https://lh3.googleusercontent.com/a/ACg8ocL-VBCznRMPJ183d-Y1liSWfH0esgFWGd5yBPSVF2NtlBQe=s96-c" alt="" />
                <p>Name: Jayant Raj Singh</p>
                <p>Highest Score: xxx</p>
                <button className='btn linkBtn' onClick={()=>handleLogout()}>Logout</button>
                <button className='btn linkBtn' onClick={()=>showLeaderBoard()}>Leader Board</button>
            </div>
            
        </>
    );
};


export default UserDropdown;
