import React from 'react';
import { useEffect, useRef, useState } from 'react';
import config from '../config.json'
import { alphabets } from '../images/alphabets';
import GameAudio from './GameAudio';


const JSnake = ({saveHighScore, isLoggedin, lastHighScore, setLastHighScore}) => {
    const [snake, setSnake] = useState(config.initial_snake)
    const [food, setFood] = useState(config.games.survival.initial_food)
    const [snakeSpeed, setSnakeSpeed] = useState(null)
    const [gameOver, setGameOver] = useState(true)
    const [score, setScore] = useState(-1)
    const [snakeDir, setSnakeDir] = useState()
    const [level, setLevel] = useState(0)
    const [showLevel, setShowLevel] = useState(false)
    const [currentWord, setCurrentWord] = useState()
    const [type, setType] = useState('survival')
    const [playAudio, setPlayAudio] = useState()
    const Canvas = useRef();
  
    const [alphabetArr, setAlphabetArr] = useState([])
  
    const startGame = (type, level) => {
      updateEventListeners('add')
      setType(type)
      setSnake(config.initial_snake)
      if(type === 'survival'){
        setFood(config.games.survival.initial_food)
      }else{
        const word = getRandomWord(level)
        setCurrentWord(word)
        createNewFood(config.initial_snake, 0, 0, type, word)
      }
      setScore(0)
      setLevel(level)
      setGameOver(false)
      setSnakeDir([0,-1])
      setSnakeSpeed(config.games[type].levels[level].inital_speed)
  
    }

    const endGame = () => {
      updateEventListeners('remove')
      setGameOver(true)
      setSnakeSpeed(null)
    }
    
    const getRandomWord = (level) => {
        const words = config.games.words.levels[level].words
        const rndIndex = Math.floor((Math.random() * words.length))
        return words[rndIndex]
    }


    const createFood = (type, letter) =>{
      let newFood = JSON.parse(JSON.stringify(food[0]))
      let newFoodPosition = newFood.pos.map((axis, index) => Math.floor(Math.random() * ((index>0? config.canvas_width:config.canvas_height) / config.canvas_scale)));
      newFood.pos = newFoodPosition
    
      if(type === 'words'){
        newFood.letter = letter
      }
      return newFood
    }
  
    const getPoint = (type, level, point, updatedScore) => {
      if(type === 'words'){
        return config.games[type].levels[level].word_point/ config.games[type].levels[level].word_length
      }else{
        return (updatedScore % config.games[type].levels[level].score_devider === 0)?point+config.games[type].levels[level].point_accleration:point
      }
    }
  
    const getSpeed = (type, level, speed, updatedScore) => {
      return (updatedScore % config.games[type].levels[level].score_devider === 0)?speed-config.games[type].levels[level].accleration:speed
    }
    
    const createNewFood = (nextSnake, prevPoint, updatedScore, type, word) => {
      let foods = []
      if(type==='words'){
        word.toLowerCase().split('').forEach((letter)=>{
          let newFood = createFood(type, letter);
          while (checkCollision(newFood.pos, nextSnake)) {
            newFood = createFood(type, letter);
          }
          const newPoint = getPoint(type, level, prevPoint, updatedScore)
          if(newPoint !== newFood.point){
            newFood.point = newPoint
          }
          foods.push(newFood)
        })
      }else{
        let newFood = createFood(type);
          while (checkCollision(newFood.pos, nextSnake)) {
            newFood = createFood(type);
          }
          const newPoint = getPoint(type, level, prevPoint, updatedScore)
          if(newPoint !== newFood.point){
            newFood.point = newPoint
          }
          foods.push(newFood)
      }
      setFood(foods);
    }
  
    const checkFoodCollision = nextSnake => {
      const hasCollision = food.filter((fd, i)=>{
        if (nextSnake[0][0] === fd.pos[0] && nextSnake[0][1] === fd.pos[1]) {
          return true;
        }
        return false
      })
      return hasCollision;
    };
  
    const checkCollision = (item, snk = snake) => {
      if (
        item[0] * config.canvas_scale >= config.canvas_width ||
        item[0] < 0 ||
        item[1] * config.canvas_scale >= config.canvas_width ||
        item[1] < 0
      )
        return true;
  
      for (const segment of snk) {
        if (item[0] === segment[0] && item[1] === segment[1]) return true;
      }
      return false;
    }
  
    const gameLoop = () => {
      const nextSnake = JSON.parse(JSON.stringify(snake))
      const nextSnakeHead = [nextSnake[0][0] + snakeDir[0], nextSnake[0][1] + snakeDir[1]]
      nextSnake.unshift(nextSnakeHead)
      if(checkCollision(nextSnakeHead)){
        endGame()
      }
      const hasCollision= checkFoodCollision(nextSnake)
      if( hasCollision.length < 1){
        nextSnake.pop()
      }else{
        setPlayAudio('eating')
        setScore(prevScore => {
          const newScore = prevScore + hasCollision[0].point
          updateFood(nextSnake, hasCollision[0], newScore, type)
          return newScore
        })
      }
      setSnake(nextSnake)
    }

    const updateFood = (nextSnake, collidedItem, newScore, type) => {
      if(type==='words'){
            setAlphabetArr([...alphabetArr,collidedItem.letter])
            clearLetter(collidedItem)
            if(newScore % config.games[type].levels[level].word_point === 0){
              const word = getRandomWord(level)
              checkCompleteWord(()=>{
                setCurrentWord(word)
                createNewFood(nextSnake, collidedItem.point, newScore, type, word)
              }, ()=>{
                setGameOver(true)
              })
            }
          }else{
            createNewFood(nextSnake, collidedItem.point, newScore, type)
          }
    }
  
    const checkCompleteWord = (success, falied) => {
        setAlphabetArr((prevArr) => {
          if(prevArr.join('')=== currentWord.toLowerCase()){
            success()
          }else{
            falied()
          }
          return []
        })
    }
  
    const clearLetter = (letter) => {
      const updatedFood = food.filter(item => {
        return JSON.stringify(item) !== JSON.stringify(letter)
      })
      setFood(updatedFood)
    }
  
    const changeSnakeDir = ({keyCode}, snakeDir) => {
      let changedDirectrion = snakeDir
      switch (keyCode) {
        case 37:
          changedDirectrion = [-1,0]
          break;
        case 38:
          changedDirectrion = [0,-1]
          break;
        case 39:
          changedDirectrion = [1,0]
          break;
        case 40:
          changedDirectrion = [0,1]
          break;
        default:
          break;
      }
      setSnakeDir(prevDir => {
        if(changedDirectrion[0]+prevDir[0] !== 0 || changedDirectrion[1]+prevDir[1] !== 0){
          return changedDirectrion
        }
        return prevDir
      })
    }
  
    const updateEventListeners = (task) => {
      if(task === 'add'){
        document.addEventListener('keyup', (e)=>changeSnakeDir(e))
      }else{
        document.removeEventListener('keyup', (e)=>changeSnakeDir(e))
      }
    }


    useEffect(()=>{
      let gameInterval
      if(!gameOver){
        gameInterval = setInterval(()=>{
          gameLoop()
        },snakeSpeed)
      }else{
        clearInterval(gameInterval)
      }
      return () => {clearInterval(gameInterval)}
    })
  
    useEffect(()=>{
      if(score>0){
        setSnakeSpeed(getSpeed(type, level, snakeSpeed, score))
      }
    },[score])
  
    const drawSnake = (canvasCtx) => {
      canvasCtx.fillStyle = 'green'
      snake.forEach(([x,y])=>{
        canvasCtx.fillRect(x,y,1,1)
      })
    }
  
    const drawFood = (canvasCtx)=>{
      canvasCtx.fillStyle = 'red'
      food.forEach(({pos, letter})=>{
        if(type==="words"){
          canvasCtx.font = `1px Arial`;
          let img = new Image()
          img.src = alphabets[letter]
          canvasCtx.fillStyle = '#000'
          canvasCtx.drawImage(img, pos[0], pos[1], 1, 1);
        }else{
          canvasCtx.fillRect(pos[0],pos[1],1,1)
        }
      })
    }
  
    const setScoreToLocalStorage = () => {
      const lastHighScore = localStorage.getItem('highScore') || 0
      if(score > lastHighScore){
        localStorage.setItem('highScore', score)
        setLastHighScore(score)
      }
    }

    useEffect(()=>{
      if(playAudio === 'eating' || playAudio === 'gameover'){
        setPlayAudio('')
        setScoreToLocalStorage()
      }
    },[playAudio])


    useEffect(()=>{
        if(gameOver && score !== -1){
            setPlayAudio('gameover')
        }
      const canvasCtx = Canvas.current.getContext('2d')
      canvasCtx.setTransform(config.canvas_scale,0,0,config.canvas_scale,0,0)
      canvasCtx.clearRect(0,0,config.canvas_width,config.canvas_height)
      drawSnake(canvasCtx)
      drawFood(canvasCtx)
    },[snake, food, gameOver])
  
  
    return (
        <div className="canvasContainer">
            <div className={`gameContainer ${!gameOver?'playing':''}`}>
                <div className="topScoreContainer">
                    <p style={{color:!gameOver?'#fff':'red'}}>Score: {(score>0&&score)|| 0}</p>
                    <p style={{color:'#fff'}}>High Score: {lastHighScore}</p>
                </div>
                <canvas height={config.canvas_height} width={config.canvas_width} ref={Canvas} className='gameCanvas' ></canvas>
            </div>
            <div className={`canvasOverlay ${!gameOver?'playing':''}`}>
                <div className="logo">
                    j~Snake
                </div>
                {
                    gameOver && score > -1?
                    <div className='gameScore'>
                        <p className="go">
                            Game Over
                        </p>
                        {score}
                    </div>:null
                }
                {isLoggedin&&<button className='btn lbBtn' onClick={()=>saveHighScore(score>=lastHighScore?score:lastHighScore)}>Join leader board</button>}
                <div className='btnContainer'>
                    {
                        config.game_types.map((item)=>{
                            return <button className={`btn ${showLevel===item?'active':''}`} key={item} onClick={()=>setShowLevel(item)}>{item==='survival'?'Survival':'Guess the Word'}</button>
                        })
                    }
                </div>
                {showLevel ?
                    <div className='btnContainer'>
                        <button className='btn lBtn' onClick={()=>startGame(showLevel,0)}>Easy</button>
                        <button className='btn lBtn' onClick={()=>startGame(showLevel,1)}>Medium</button>
                        <button className='btn lBtn' onClick={()=>startGame(showLevel,2)}>Hard</button>
                    </div>:null
                }
            </div>
            <GameAudio audioType={playAudio} />
        </div>
    );
}

export default JSnake;
