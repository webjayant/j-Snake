import {useEffect, useState}  from 'react'
import JSnake from "./components/jSnake";
import Header from "./components/Header";
import { loginUser, logoutUser } from "./utils/netlifyIdentity";
import netlifyIdentity from 'netlify-identity-widget'
import './App.css';


function App() {
  const [currentUser, setCurrentUser] = useState()

  netlifyIdentity.on('login', ()=>{
     const user = localStorage.getItem("currentUser");
      console.log(user, 'usr')
      if (user) {
        setCurrentUser(JSON.parse(user))
      }
  })
  netlifyIdentity.on('logout', ()=>{
       setCurrentUser(null)
 })
  return(
    <>
      <Header handleLogin={loginUser} handleLogout={logoutUser} currentUser={currentUser}/>
      <JSnake />
    </>
  )
}

export default App;
