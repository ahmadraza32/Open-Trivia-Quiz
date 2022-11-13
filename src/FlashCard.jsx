import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'

export default function FlashCard({flashcard}) {
  const [flip, setFlip] = useState(false)
  const [height, setHeight] = useState('initial')

  const frontEl = useRef()
  const backEl = useRef()

  function maxHeight(){
    let frontHeight = frontEl.current.getBoundingClientRect().height
    let backHeight = backEl.current.getBoundingClientRect().height

    setHeight(Math.max(frontHeight, backHeight, 100))
  }

  useEffect(maxHeight, [flashcard.question, flashcard.answer, flashcard.options])
  useEffect(() => {
    window.addEventListener('resize', maxHeight)
    return () => window.removeEventListener('resize', maxHeight)
  })

  return (
    <div style={{ height }} className={'card ' + (flip ? 'flip' : '')} onClick={() => setFlip(prev => !prev)}>
      <div className="front" ref={frontEl}>
        {flashcard.question}
        <div className="options">
          {
            flashcard.options.map(option => {
              return <div className="option" key={option}> {option} </div>
            })
          }
        </div>
      </div>

      <div ref={backEl} className="back">
        {flashcard.answer}
      </div>
    </div>
  )
}
