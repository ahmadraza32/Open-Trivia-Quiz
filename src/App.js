import React from 'react'
import { useState } from 'react'
import FlashCardList from './FlashCardList'
import  './App.css'
import { useEffect } from 'react'
import axios from 'axios'
import { useRef } from 'react'

function App() {
  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] = useState([])

  const amountEl = useRef()
  const categoryEl = useRef()

  useEffect(
    () => {
      let abortControler = new AbortController()
      async function getData(){
        try {
          const res = await fetch('https://opentdb.com/api_category.php', { signal: abortControler.signal})
          const data = await res.json()
          setCategories(data.trivia_categories);
        } catch (error) {
          console.log(error);
        }
      }
      getData()

      return () => abortControler.abort()
    },[])

    async function handleSubmit(e){
      e.preventDefault()

      try{
        const {data} = await axios.get('https://opentdb.com/api.php', {
          params: {
            category: categoryEl.current.value,
            amount: amountEl.current.value
          }
        })
        
        setFlashcards(data.results.map((questionItem, i) => {
          let answer = decode(questionItem.correct_answer)
          let options = [...questionItem.incorrect_answers.map(a => decode(a)), answer]

          return {
            id: `${i}-${Date.now()}`,
            question: decode(questionItem.question),
            answer,
            options: options.sort(() => Math.random() - .5)
          }
        }));
      }
      catch(err){
        console.log(err.message)
      }
    }

  function decode(str){
    const textarea = document.createElement('textarea')
    textarea.innerHTML = str

    return textarea.value
  }

  return (
    <>
      <form className='form' onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Question category</label>
          <select name="" id="category">
            {
              categories.map(category => {
                return <option value={category.id} ref={categoryEl} key={category.id}> {category.name} </option>
              })
            }
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="number">Number of Question</label>
          <input type="number" name="" id="number" ref={amountEl} step="1" defaultValue="10" />
        </div>
        <div className='form-group'>
          <button>Submit</button>
        </div>

      </form>

      <div className="container">
        <FlashCardList flashcards={flashcards} />
      </div>
    </>
  )
}

export default App

const sampleCard = [
  {
    id: 1,
    question: 'what is 2 + 2 ?',
    answer: '4',
    options: ['4','5','2','56']
  },
  {
    id: 12,
    question: 'what is 2 + 2 ?',
    answer: '4',
    options: ['4','5','2','56']
  }
]
