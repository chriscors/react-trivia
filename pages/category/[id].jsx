import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Quiz.module.css";
import parse from 'html-react-parser';
import classNames from "classnames";
import {clsx} from "clsx";

const colors = ["red","yellow","pink","green","orange","purple","blue"]

export default function Quiz() {
  const router = useRouter()
  //States
  const [questions, setQuestions] = useState(null)
  const [questionNum, setQuestionNum] = useState(0)
  const [quizState, setQuizState] = useState('loading') //STATES: loading, playing, correct, incorrect, finished
  //Refs
  const category = useRef(null)
  const score = useRef(0)

  useEffect(() => {
    if (!router.isReady) return;
  
    const categoryID = router.query.id
    
    const URL = `https://opentdb.com/api.php?amount=10&category=${categoryID}`
    axios.get(URL).then((response) => {
      category.current = response.data.results[0].category
      let cleanResult = response.data.results

      //Make an array of questions and shuffle them
      for (const question of cleanResult){
        question.answers = [question.correct_answer ]
        question['incorrect_answers'].forEach(element => { question.answers.push(element) });
        question.answers = shuffle(question.answers)
      }
      setQuestions(cleanResult)

      
    })
  }, [router.isReady])
  
  //Set components have loaded so they stop fading in on rerender
  useEffect(() => {
    setTimeout(() => {
      setQuizState('playing')
    }, 1000);
  },[])

  if (questions) {
    return (
    <><div className="mx-2">
      <div className="d-flex mt-2 justify-content-between">
        <h2 className="d-inline-block">{category.current}</h2>
        <h2 className="d-inline-block">Score: {score.current}</h2>
        <h2 className="d-inline-block text-right">Question {questionNum + 1}/10</h2>
      </div >
      <div className={styles.title}>
          <h1 className={clsx({'text-center':true, [styles['fade-in']]: quizState === 'loading'})}>{parse(questions[questionNum].question)}</h1>
      </div>
      <div class="button-row row gx-3 my-5 justify-content-center">
          {questions[questionNum].answers.map((answer, ind) => {
            return <Choice
              answer={answer}
              correctAnswer={questions[questionNum]["correct_answer"]}
              setQuestionNum={setQuestionNum}
              score={score}
              key={ind}
              index={ind}
              quizState={quizState}
              setQuizState={setQuizState}
            />
          })}
      </div>
    </div></>
    )
  }
}


function Choice({ answer, correctAnswer, setQuestionNum, score, index, quizState, setQuizState }) {
  const clicked = useRef(false)
  function handleAnswer(e) {
    clicked.current = true
    if (correctAnswer === answer) {
      setQuizState("correct")
      score.current++;
    }
    else {
      setQuizState("incorrect")
    }
    //setQuestionNum(setQuestionNum => setQuestionNum + 1)
  }
  //if this was the correct answer and it was clicked: make green
  if (clicked.current) {
    if (quizState === "correct") {
      return (<><div className={`col-md-auto ${styles.correct}`}>
        <input className={styles.input} type="radio" name={index} id={index} key={`input${index}`} />
        <label className={styles.label} htmlFor={index} key={`label${index}`} style={{ "--color": "green" }}>{parse(answer)}</label>
      </div></>)
      //if this was the incorrect answer and it was clicked: make red
    } else if (quizState === "incorrect") {
      return (<><div className={`col-md-auto ${styles.incorrect}`}>
        <input className={styles.input} type="radio" name={index} id={index} key={`input${index}`} />
        <label className={styles.label} htmlFor={index} key={`label${index}`} style={{ "--color": "red" }}>{parse(answer)}</label>
      </div></>)
    } //The question WAS answered but this wasnt the one clicked: hide the button
  } else if ((quizState === "correct" || quizState === "incorrect") && !clicked.current){
    return <><div class="col-md-auto">
      <input className={styles.input} type="radio" name={index} id={index} key={`input${index}`} />
      <label className={`${styles.label} ${styles.hidden}`} htmlFor={index} key={`label${index}`} style={{ "--color": colors[index % (colors.length - 1)] }} onClick={() => handleAnswer(this)}>{parse(answer)}</label>
    </div></>
    //else print regularly
  } else return (
    <><div class="col-md-auto">
      <input className={styles.input} type="radio" name={index} id={index} key={`input${index}`} />
      <label className={clsx({ [styles.label]: true, [styles['fade-in']]: quizState === 'loading', })} htmlFor={index} key={`label${index}`} style={{ "--color": colors[index % (colors.length - 1)] }} onClick={() => handleAnswer(this)}>{parse(answer)}</label>
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