import {useEffect, useState}  from 'react'
import JSnake from "./components/jSnake";
import Header from "./components/Header";
import { loginUser, logoutUser } from "./utils/netlifyIdentity";
import netlifyIdentity from 'netlify-identity-widget'
import './App.css';


function App() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser'))
  const [isLoggedin, setIsLoggedin] = useState(false)
  const [lastHighScore, setLastHighScore] = useState(localStorage.getItem('highScore') || 0)

  netlifyIdentity.on('login', ()=>{
    setIsLoggedin(true)
  })
  netlifyIdentity.on('logout', ()=>{
    setIsLoggedin(false)
 })

 const saveHighScore = (highScore) => {

  fetch('/.netlify/functions/score-board', {
    method: 'POST',
    body:JSON.stringify({email: currentUser.email, score: highScore})
  }).then((response)=>{
      console.log(response)
  })
 }

 const getLastHighScore = (email) => {
  fetch(`/.netlify/functions/score-board/${email}`).then((response)=>{
      console.log(response.body.score)
      setLastHighScore(response.body.score)
  })
 }

 useEffect(()=>{
  if(isLoggedin){
    const user = localStorage.getItem("gotrue.user");
    if (user) {
      const {
        app_metadata, created_at, confirmed_at, email, id, user_metadata
      } = JSON.parse(user)
      getLastHighScore(email)
      setCurrentUser({...app_metadata, created_at, confirmed_at, email, id, ...user_metadata})
    }
  }
 },[isLoggedin])

 useEffect(()=>{
  const user = localStorage.getItem("gotrue.user");
  console.log(user, 'UU')
  if (user) {
    setIsLoggedin(true)
  }
 },[])


  return(
    <>
      <Header handleLogin={loginUser} handleLogout={logoutUser} currentUser={currentUser} isLoggedin={isLoggedin}/>
      <JSnake saveHighScore={saveHighScore} isLoggedin={isLoggedin} lastHighScore={lastHighScore} setLastHighScore={setLastHighScore}/>
    </>
  )
}

export default App;
