
import JSnake from "./components/jSnake";
import Header from "./components/Header";
import './App.css';
import netlifyIdentity from 'netlify-identity-widget'


function App() {
  const handleLogin = () => {
      netlifyIdentity.open()
  }
  return(
    <>
      <Header handleLogin={handleLogin}/>
      <JSnake />
    </>
  )
}

export default App;
