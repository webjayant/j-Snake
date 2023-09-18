import React, {useEffect, useRef} from 'react';
import eating from '../audios/eating.wav'
import gameover from '../audios/gameover.wav'

const GameAudio = ({audioType}) => {
    const EatingAudio = useRef();
    const EndGameAudio = useRef();

    useEffect(() => {
        if(audioType === 'eating'){
            const player = EatingAudio.current
            player.currentTime = 0
            player.play()
        }
        if(audioType === 'gameover'){
            const player = EndGameAudio.current
            player.currentTime = 0
            player.play()
        }
    },[audioType])

    return (
        <>
            <audio ref={EatingAudio} src={eating} className='audioPlayback'></audio>
            <audio ref={EndGameAudio} src={gameover} className='audioPlayback'></audio>
        </>
    );
}

export default GameAudio;
