import {useEffect, useState}  from 'react'
import JSnake from "./components/jSnake";
import Header from "./components/Header";
import { loginUser, logoutUser } from "./utils/netlifyIdentity";
import netlifyIdentity from 'netlify-identity-widget'
import './App.css';


function App() {
  const [currentUser, setCurrentUser] = useState()
  const [isLoggedin, setIsLoggedin] = useState(false)

  netlifyIdentity.on('login', ()=>{
    setIsLoggedin(true)
  })
  netlifyIdentity.on('logout', ()=>{
    setIsLoggedin(false)
 })

 useEffect(()=>{
  if(isLoggedin){
    const user = localStorage.getItem("currentUser");
    console.log(user, 'usr')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }
 },[isLoggedin])

  return(
    <>
      <Header handleLogin={loginUser} handleLogout={logoutUser} currentUser={currentUser} isLoggedin={isLoggedin}/>
      <JSnake />
    </>
  )
}

export default App;
