import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Quiz.module.css";
import parse from 'html-react-parser';

const colors = ["red","yellow","pink","green","orange","purple","blue"]

export default function Quiz() {
  const router = useRouter()
  const [questions, setQuestions] = useState(null)
  const [questionNum, setQuestionNum] = useState(0)
  const category = useRef(null)
  const score = useRef(0)

  useEffect(() => {
    if (!router.isReady) return;
  
    const categoryID = router.query.id
    console.log(categoryID)
    
    const URL = `https://opentdb.com/api.php?amount=10&category=${categoryID}`
    console.log(URL);
    axios.get(URL).then((response) => {
      console.log(response)
      category.current = response.data.results[0].category
      let cleanResult = response.data.results

      //Make an array of questions and shuffle them
      for (const question of cleanResult){
        question.answers = [question.correct_answer ]
        question['incorrect_answers'].forEach(element => { question.answers.push(element) });
        question.answers = shuffle(question.answers)
      }
      console.log(cleanResult)
      setQuestions(cleanResult)

      
    })
  }, [router.isReady])
  

  if (questions) {
    return (
    <><div className="mx-2">
      <div className="d-flex justify-content-between">
        <h1 className="d-inline-block">{category.current}</h1>
        <h1 className="d-inline-block">Score: {score.current}</h1>
        <h1 className="d-inline-block text-right">Question {questionNum + 1}/10</h1>
        </div >
        <div className={styles.title}>
          <h2>{parse(questions[questionNum].question)}</h2>
        </div>
      <div class="button-row row gx-3 my-5 justify-content-center">
          {questions[questionNum].answers.map((answer, ind) => {
            return <Choice answer={answer} correctAnswer={questions[questionNum]["correct_answer"]} setQuestionNum={setQuestionNum} score={score} key={ind} index={ind} />
          })}
      </div>
    </div></>
    )
  }
}


function Choice({answer, correctAnswer, setQuestionNum, score, index}) {
  function handleAnswer(e) {
    if (correctAnswer === answer) {
      score.current++;
      //return some kind of popup saying correct
    }
    else {
      //popup or something incorect
    }
    setQuestionNum(setQuestionNum => setQuestionNum + 1)
  }

  return (
  <><div class="col-md-auto">
    <input className={styles.input} type="radio" name={index} id={index} key={`input${index}`} />
    <label className={`${styles.label}`} htmlFor={index} key={`label${index}`} style = {{"--color": colors[index%(colors.length-1)]}} onClick={() => handleAnswer(this)}>{parse(answer)}</label>
  </div></>
  )
}


function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}