// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react'

// data
import {wordsList} from './data/words.js'

// components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id:1, name: 'start'},
  {id:2, name: 'game'},
  {id:3, name: 'end'}
]

const guessesQty = 3 

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory =  useCallback(() => {
    //pick a random category
    const categories =  Object.keys(words)
    const category = categories[Math.floor(Math.random() *  Object.keys(categories).length)]
    console.log(category)

    //pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word);

    return [word, category]
     
  }, [words])

  // starts the secret word game
  const startGame =  useCallback(() => {
    clearLetterStates();
    //pick word and pick category
    const  [word, category] = pickWordAndCategory()
    //console.log(word, category);
    
    //create array of letters
    const wordLetters = word.split("").map((l) => l.toLowerCase())
    //console.log(wordLetters);
    
    //fil states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)
    
    setGameStage(stages[1].name)
  }, [pickWordAndCategory])
  // process the letter input
  const verifyLetter = (letter) => {
   
    const normalizedLetter = letter.toLowerCase()

    // chek if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
    }

    
/*
  Permitindo que letras não acentadas sejam correspondidas à letras acentuadas também
  Contexto
  A ideia aqui é:
  Transformar caracteres acentuados, como á, ç, ã, em suas formas básicas: a, c, a.
  Para isso, usamos normalização Unicode para decompor os caracteres em suas partes básicas e remover os diacríticos (os sinais que compõem os acentos).
  Parte 1: .normalize('NFD')
  A função normalize() é um método JavaScript que ajusta um texto para um formato Unicode específico. Unicode define formas diferentes de representar o mesmo caractere.
  O que é NFD?
  NFD significa Normalization Form Decomposition, ou seja, "Forma de Normalização por Decomposição". Essa forma divide os caracteres em partes separadas.
  Por exemplo:
  O caractere á é decomposto em dois elementos:
  a (a base)
  ´ (o acento agudo, chamado de diacrítico).
  O mesmo acontece com outros caracteres acentuados:
  ç → c + cedilha
  ê → e + circunflexo
  Parte 2: .replace(/[\u0300-\u036f]/g, '')
  Agora que normalize('NFD') separou os caracteres em base + diacríticos, precisamos remover os diacríticos (acentos, til, cedilha, etc.).
  O que significa /[\u0300-\u036f]/g?
  Essa é uma expressão regular (regex) que encontra todos os diacríticos. Vamos quebrá-la em partes:
  [\u0300-\u036f]:
  Isso define um intervalo de códigos Unicode.
  \u0300 a \u036f:
  Esse intervalo cobre os caracteres Unicode usados para representar diacríticos.
  Inclui acentos agudos, graves, circunflexos, cedilhas, tildes, etc.
  Por exemplo:
  \u0301 = acento agudo (´)
  \u0300 = acento grave (`)
  \u0303 = til (~)
  \u0327 = cedilha (¸)
  /g:
  O modificador g significa "global", ou seja, remove todas as ocorrências dos diacríticos na string.
  replace(..., ''):
  Substitui os diacríticos encontrados por uma string vazia (''), ou seja, remove os diacríticos.
  Resumo do Processo
  Normalização NFD:
  Decompõe os caracteres acentuados em base + diacríticos.
  Exemplo: á → a + '´.
  Remoção dos diacríticos:
  A regex [u0300-\u036f] localiza os diacríticos.
  replace(..., '') remove os diacríticos da string.
  Resultado Final:
  Você obtém a forma "simples" dos caracteres.
  Exemplo: áéíóúç → aeiou.  
*/
    

    // push guessed letter or remove a guess
    if(letters.map((l) => l.normalize('NFD').replace(/[\u0300-\u036f]/g, '')).includes(normalizedLetter)){
      // letra certa
      setGuessedLetters((prevGuessedLetters) => [
        ...prevGuessedLetters, normalizedLetter
      ])

    } else {
      // letra errada
      setWrongLetters((prevWrongLetters) => [
        ...prevWrongLetters, normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)

      
    }
   // setGameStage(stages[2].name)
  }



const clearLetterStates = () => {
  setGuessedLetters([])
  setWrongLetters([])
}
  
/*  
  O useEffect, monitora variáveis de estado ou props. Sempre que uma dessas variáveis (inseridas no array de dependências []) for alterada, a função passada para o useEffect será executada. Se o array de dependências estiver vazio ([]), o useEffect será executado apenas uma vez, quando o componente for montado, e nunca mais. Caso o array seja omitido, o efeito será executado em toda renderização do componente.
*/
useEffect(() => { //check if guesses ended

  if(guesses <= 0 ){ 
    //reset all stages
    clearLetterStates();

    setGameStage(stages[2].name);
  }

}, [guesses])

useEffect(() => {//check win condition

  if (letters.length === 0 || guessedLetters.length === 0) {
    return; // Não executa se os arrays estiverem vazios
  }

  const uniqueLetters = [...new Set(letters.map((l) => l.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))] // o new Set(), só deixa itens únicos em um array
  
  console.log(uniqueLetters);
  console.log(guessedLetters);

  console.log(uniqueLetters.length);
  console.log(guessedLetters.length);
 
  // win condition
  if(guessedLetters.length === uniqueLetters.length){
    //add score
    setScore((actualScore) => actualScore += 100)    
    // restart game with new word
    startGame()
  }

}, [guessedLetters, letters, startGame])

  // restarts the game
  const retry = () => {

    setScore(0)
    setGuesses(guessesQty)


    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game 
          verifyLetter={verifyLetter} 
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />)}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
