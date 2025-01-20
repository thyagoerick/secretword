// CSS
import { useState, useRef } from 'react'
import './Game.css'

const Game = ({
    verifyLetter,
    pickedWord,
    pickedCategory,
    letters,
    guessedLetters,
    wrongLetters,
    guesses,
    score
}) => {

  const [letter, setLetter] = useState("")
  const letterInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()   
    verifyLetter(letter.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
    setLetter("")

    // fazendo usando o hook useRef
    letterInputRef.current.focus()   
    
    // fazendo sem o useRef
    // const inputElement = document.querySelector('.letterContainer input');
    // inputElement.addEventListener('blur', () => inputElement.focus());
    // inputElement.focus();
  }

  return (
    <div className='game'>
        <p className="points">
            <span>Pontuação: {score}</span>
        </p>
        <h1>Adivinhe a palavra</h1>
        <h3 className="tip">
            Dica sobre a palavra: <span>{pickedCategory}</span>
        </h3>
        <p>Você ainda tem {guesses} tentativa(s).</p>
        <div className="wordContainer">
            {
                letters.map( (l, i) => {
                   
                   const normalizedLetter = l.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                   const isGuessed = guessedLetters.includes(normalizedLetter);
                    
                    return isGuessed ? (
                        <span key={i} className="letter">{l}</span>
                    ) : (
                        <span key={i} className="blankSquare"></span>
                    );
                })
            }
        </div>
        <div className="letterContainer">
            <p>Tenter adivinhar uma letra da palavra:</p>
            <form onSubmit={handleSubmit}>
                <input type="text" name="letter" id="" maxLength="1" required="required" 
                value={letter}
                onChange={e => setLetter(e.target.value)} ref={letterInputRef}/>
                <button>Jogar!</button>
            </form>
        </div>
        <div className="wrongLetterContainer">
            <p>Letras já utilizadas:</p>
            {wrongLetters.map((l, i) => (
                <span key={i}>{l},</span>
            ))}
        </div>
    </div>
  )
}

export default Game